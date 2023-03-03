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
            await ctx.stub.putState(customers[i].cuId, Buffer.from(JSON.stringify(customers[i])));
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
}
