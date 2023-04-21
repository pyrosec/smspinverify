import { SmsPinVerifyClient } from "./smspinverify";
import "setimmediate";
export declare function saveSession(smspinverify: any, json?: boolean, filename?: string): Promise<void>;
export declare function initSession({ apiKey }: {
    apiKey: any;
}): Promise<void>;
export declare function loadSession(): Promise<SmsPinVerifyClient>;
export declare function callAPI(command: any, data: any): Promise<any>;
export declare function saveSessionAs(name: any): Promise<void>;
export declare function loadSessionFrom(name: any): Promise<void>;
export declare function loadFiles(data: any): Promise<any>;
export declare function runCLI(): Promise<any>;
