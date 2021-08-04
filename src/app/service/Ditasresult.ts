class Info1 {
    token: string;
    ttl: number;
    dto: string;
}

class Data {
    resCode: number;
    resMessage: string;
    info: Info1
}

class Status {
    statusCode: number;
    message: string;
}

class Result {
      data: Data;
      status: Status;
}

export class Ditasresult {
      result: Result;
      status: Status
}

