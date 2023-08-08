export declare class SmsPinVerifyClient {
    static BASE_URL: string;
    apiKey: string;
    last: any;
    constructor(o: any);
    toObject(): {
        last: any;
        apiKey: string;
    };
    toJSON(): string;
    static fromObject(o: any): SmsPinVerifyClient;
    static fromJSON(s: any): SmsPinVerifyClient;
    _call(pathname: any, data?: {}, headers?: {}): Promise<any>;
    checkBalance(): Promise<any>;
    checkRates({ country }: {
        country: any;
    }): Promise<any>;
    getHistory(): Promise<any>;
    getSms({ number, country, app }: {
        number: any;
        country: any;
        app: any;
    }): Promise<any>;
    getNumber({ app, country }: {
        app: any;
        country: any;
    }): Promise<any>;
}
