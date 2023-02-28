/*
 * SPDX-License-Identifier: Apache-2.0
 */

export class Provider {
    public proId?: string;
    public username: string;
    public password: string;
    public listServiceStat: ServiceStat[];
    public successDataCount: number;
    public allSendDataCount: number;
    public ratingProvider: number;
}

export class Customer{
    public cuId?: string;
    public username: string;
    public password: string;
}

export class ServiceStat{
    public serviceId?: string;
    public successCountLv1: number;
    public totalCountLv1: number;
    public satisfaction: number;
    public serviceAgreements: ServiceAgreement[];
}

export class ServiceAgreement{
    public agreementID?: string;
    public agreementContent: string;
    public totalCountLv2: number;
    public successCountLv2: number;
    public ruleList: RulePenalty[];
}

export class RulePenalty{
    public ruleID?: string;
    public ruleContent: string;
    public totalCountLv3: number;
    public successCountLv3: number;
    public rule: RuleDetail;
}

export class RuleDetail{
    public rate: number;
    public trending: string;
    public uint: string;
}

export class LocationService{
    public province: string;
    public district: string;
    public address: string;
}

export class ContractInfo{
    public assetId?: string;
    public serviceId: string;
    public documentHash: string[];
    public creator: string; //provider
    public signator: string; //customer
    public location: LocationService;
    public description: string;
    public dayStart: string;
    public dayEnd: string;
    public time: number;
    public price: number;
    public successCount: number;
    public totalCount: number;
    public rateSuccessCommit: number;
    public rateSuccess: number;
}

export class ExternalApilist{
    public key: string;
    public ruleId?: string;
    public apiList: string[];
    public contractId: string;
}