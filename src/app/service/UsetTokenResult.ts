export interface ContractingPartyLicense {
    name: string;
    noMedicalSystem: number;
}

export interface Info {
    sessionId: string;
    accessNodes: string[];
    additionalProperties: string[];
    contractingPartyLicense: ContractingPartyLicense[];
    userId: number;
    fullName: string;
    gender: string;
    cellPhone: string;
    isTwoStep: boolean;
    partnerName: string;
    partnerNN: string;
    cPartyNN: string;
    partnerId: number;
    cPartyId: number;
}

export interface Data {
    resCode: number;
    resMessage: string;
    info: Info;
}

export interface Status {
    statusCode: number;
}

export interface Result {
    data: Data;
    status: Status;
}

export interface Status2 {
    statusCode: number;
    message: string;
}

// tslint:disable-next-line:class-name
export interface usetToken {
    result: Result;
    status: Status2;
}
