/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Provider } from './model';
import { Customer } from './model';

export class ProviderLogic extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const providers: Provider[] = [];

        for (let i = 0; i < providers.length; i++) {
            providers[i].proId = 'pro1';
            await ctx.stub.putState('PRO1' + i, Buffer.from(JSON.stringify(providers[i])));
            console.info('Added <--> ', providers[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryProvider(ctx: Context, proId: string): Promise<string> {
        const providerAsBytes = await ctx.stub.getState(proId); // get the car from chaincode state
        if (!providerAsBytes || providerAsBytes.length === 0) {
            throw new Error(`${proId} does not exist`);
        }
        console.log(providerAsBytes.toString());
        return providerAsBytes.toString();
    }

    public async createProvider(ctx: Context, proId: string, username: string, password: string) {
        console.info('============= START : Create Provider ===========');

        const provider: Provider = {
            proId,
            username,
            password            
        };

        await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)));
        console.info('============= END : Create Provider ===========');
    }

    public async queryAllProviders(ctx: Context): Promise<string> {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }
}
