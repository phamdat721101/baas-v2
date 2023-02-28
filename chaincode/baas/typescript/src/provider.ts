/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Provider, ServiceStat, ServiceAgreement, RuleDetail, RulePenalty, ContractInfo, ExternalApilist } from './model';

export class ProviderLogic extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const providers: Provider[] = [
            {
                proId: "pro1",
                username: "pro1",
                password: "123",
                listServiceStat: [],
                successDataCount: 0,
                allSendDataCount: 0,
                ratingProvider: 0
            }
        ];

        for (let i = 0; i < providers.length; i++) {
            await ctx.stub.putState(providers[i].proId, Buffer.from(JSON.stringify(providers[i])));
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
            password,
            listServiceStat:[],
            successDataCount: 0,
            allSendDataCount: 0,
            ratingProvider: 0          
        };

        await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)));
        console.info('============= END : Create Provider ===========');
    }

    //create contract 
    public async createContract(ctx: Context, price: number, time: number, contractId: string, serviceId: string, proId: string, cuId: string, dayStart: string, dayEnd: string){
        const contract: ContractInfo = {
            assetId: contractId,
            serviceId: serviceId,
            documentHash: [],
            creator: proId,
            signator: cuId,
            location: null,
            description: "",
            dayStart: dayStart,
            dayEnd: dayEnd,
            time: time,
            price: price,
            successCount: 0,
            totalCount: 0,
            rateSuccess: 0,
            rateSuccessCommit: 0
        }

        await ctx.stub.putState(contractId, Buffer.from(JSON.stringify(contract)))
    }

    public async createApiList(ctx: Context, key: string, ruleId: string, apiList: string[], contractId: string){
        const listApi: ExternalApilist = {
            key: key,
            ruleId: ruleId,
            apiList: apiList,
            contractId: contractId
        }
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(listApi)))
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

    //add service function
    public async addService(ctx: Context, serviceId: string, proId: string) {
        console.log("===Starting add service==")
        const providerAsBytes = await ctx.stub.getState(proId);
        console.log("PQD: ", providerAsBytes)
        if (!providerAsBytes || providerAsBytes.length === 0) {
            throw new Error(`${proId} does not exist`);
            return;
        }
        const provider: Provider = JSON.parse(providerAsBytes.toString());
        console.log("Provider info: ", provider)
        if(provider.listServiceStat.length == 0){
            let serviceStat: ServiceStat = {
                serviceId,
                successCountLv1: 0,
                totalCountLv1: 0,
                satisfaction: 0,
                serviceAgreements:[]
            }
            provider.listServiceStat.push(serviceStat)
            await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)));
            return
        }

        for(let i = 0; i < provider.listServiceStat.length; i++){
            if(provider.listServiceStat[i].serviceId == serviceId){
                throw new Error("Service already existed");
                return;
            }else{
                let serviceStat: ServiceStat = {
                    serviceId,
                    successCountLv1: 0,
                    totalCountLv1: 0,
                    satisfaction: 0,
                    serviceAgreements:[]
                }
                provider.listServiceStat.push(serviceStat)
                await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)));
                return
            }
        }
    }
    //add agreement function 
    public async addAgreement(ctx: Context, serviceId: string, proId: string, agreementId: string, agrContent: string){
        const providerAsBytes = await ctx.stub.getState(proId);
        if (!providerAsBytes || providerAsBytes.length === 0) {
            throw new Error(`${proId} does not exist`);
        }

        const provider: Provider = JSON.parse(providerAsBytes.toString());
        if(provider.listServiceStat.length == 0){
            throw new Error("No service existed in provider list")
        }
        for(let i = 0; i < provider.listServiceStat.length; i++){
            if(provider.listServiceStat[i].serviceId == serviceId){
                if(provider.listServiceStat[i].serviceAgreements.length == 0){
                    let newAgreement: ServiceAgreement = {
                        agreementID: agreementId,
                        successCountLv2: 0,
                        totalCountLv2: 0,
                        agreementContent: agrContent,
                        ruleList: []
                    }
                    provider.listServiceStat[i].serviceAgreements.push(newAgreement)
                    await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)))
                    return
                }
            }

            for(let j = 0; j <= provider.listServiceStat[i].serviceAgreements.length; j++){
                if(provider.listServiceStat[i].serviceAgreements[j].agreementID == agreementId){
                    throw new Error("Agreement already existed");
                    return
                }
            }

            let newAgreement: ServiceAgreement = {
                agreementID: agreementId,
                successCountLv2: 0,
                totalCountLv2: 0,
                agreementContent: agrContent,
                ruleList: []
            }
            provider.listServiceStat[i].serviceAgreements.push(newAgreement)
            await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)))
            return
        }
        
    }   

    //add rule penalty 
    public async addRulePenalty(ctx: Context, proId: string, serviceId: string, agreementId: string, ruleId: string, ruleContent: string){
        const providerAsBytes = await ctx.stub.getState(proId);
        if (!providerAsBytes || providerAsBytes.length === 0) {
            throw new Error(`${proId} does not exist`);
            return;
        }

        const provider: Provider = JSON.parse(providerAsBytes.toString());
        if(provider.listServiceStat.length == 0){
            throw new Error("No service existed in provider");
            return
        }

        for(let i = 0; i < provider.listServiceStat.length; i++){
            if(provider.listServiceStat[i].serviceId == serviceId){
                if(provider.listServiceStat[i].serviceAgreements.length == 0){
                    throw new Error("No agreement existed in provider");
                    return
                }

                for(let j = 0; j < provider.listServiceStat[i].serviceAgreements.length; j++){
                    if(provider.listServiceStat[i].serviceAgreements[j].agreementID == agreementId){
                        if(provider.listServiceStat[i].serviceAgreements[j].ruleList.length == 0){
                            let newRule: RulePenalty ={
                                ruleID: ruleId,
                                ruleContent: ruleContent,
                                totalCountLv3: 0,
                                successCountLv3: 0,
                                rule: null
                            }

                            provider.listServiceStat[i].serviceAgreements[j].ruleList.push(newRule)
                            await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)))
                            return
                        }

                        for(let g = 0; g < provider.listServiceStat[i].serviceAgreements[j].ruleList.length; g++){
                            if(provider.listServiceStat[i].serviceAgreements[j].ruleList[g].ruleID == ruleId){
                                throw new Error("Rule already existed in provider");
                                return
                            }

                            let newRule: RulePenalty ={
                                ruleID: ruleId,
                                ruleContent: ruleContent,
                                totalCountLv3: 0,
                                successCountLv3: 0,
                                rule: null
                            }

                            provider.listServiceStat[i].serviceAgreements[j].ruleList.push(newRule)
                            await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)))
                            return
                        }
                    }
                }
            }
        }
    }

    //update ruleBidding
    public async updateRuleBiding(ctx: Context, proId: string, ruleId: string, contractId: string, status: boolean){
        const providerAsBytes = await ctx.stub.getState(proId);
        if (!providerAsBytes || providerAsBytes.length === 0) {
            throw new Error(`${proId} does not exist`);
        }

        const provider: Provider = JSON.parse(providerAsBytes.toString());
        provider.listServiceStat.forEach(sid =>{
            sid.serviceAgreements.forEach(aid =>{
                aid.ruleList.forEach(rid =>{
                    if(rid.ruleID == ruleId){
                        rid.totalCountLv3 += 1
                        if(status == true){
                            rid.successCountLv3 += 1
                        }
                    }
                })
            })
        })

        await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)))
        return
    }

    //update voting 
    public async updateVoting(ctx: Context, proId: string, contractId: string, isSuccessData: boolean, serviceId: string, slaId: string, ruleId: string){
        const providerAsBytes = await ctx.stub.getState(proId);
        if (!providerAsBytes || providerAsBytes.length === 0) {
            throw new Error(`${proId} does not exist`);
        }

        const provider: Provider = JSON.parse(providerAsBytes.toString());

        provider.allSendDataCount += 1;
        provider.listServiceStat.forEach(sid =>{
            sid.totalCountLv1 += 1
            sid.serviceAgreements.forEach(aid =>{
                aid.totalCountLv2 += 1
            })
        })

        if(isSuccessData == true){
            provider.successDataCount += 1
            provider.listServiceStat.map(sid =>{
                if(sid.serviceId == serviceId){
                    sid.successCountLv1 += 1
                    sid.serviceAgreements.map(aid =>{
                        if(aid.agreementID == slaId){
                            aid.successCountLv2 += 1
                        }
                    })
                }
            })
        }

        provider.ratingProvider = provider.successDataCount / provider.allSendDataCount;
        await ctx.stub.putState(proId, Buffer.from(JSON.stringify(provider)))
        return
    }

    //call penaltyrule
    public async callPenaltyRule(ctx: Context, proId: string, contractId: string, ruleId: string){
        
    }
}
