/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Customer } from './model';

export class CustomerLogic extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const customers: Customer[] = [];

        for (let i = 0; i < customers.length; i++) {
            customers[i].cuId = 'cu1';
            await ctx.stub.putState('PRO1' + i, Buffer.from(JSON.stringify(customers[i])));
            console.info('Added <--> ', customers[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryCustomer(ctx: Context, cuId: string): Promise<string> {
        const customerAsBytes = await ctx.stub.getState(cuId); // get the customer from chaincode state
        if (!customerAsBytes || customerAsBytes.length === 0) {
            throw new Error(`${cuId} does not exist`);
        }
        console.log(customerAsBytes.toString());
        return customerAsBytes.toString();
    }

    public async createCustomer(ctx: Context, cuId: string, username: string, password: string) {
        console.info('============= START : Create Customer ===========');

        const customer: Customer = {
            cuId,
            username,
            password            
        };

        await ctx.stub.putState(cuId, Buffer.from(JSON.stringify(customer)));
        console.info('============= END : Create Customer ===========');
    }

    public async queryAllCustomers(ctx: Context): Promise<string> {
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
