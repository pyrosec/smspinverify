"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsPinVerifyClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const querystring_1 = __importDefault(require("querystring"));
class SmsPinVerifyClient {
    constructor(o) {
        this.apiKey = o.apiKey;
        this.last = o.last;
    }
    toObject() {
        return {
            last: this.last,
            apiKey: this.apiKey
        };
    }
    toJSON() {
        return JSON.stringify(this.toObject(), null, 2);
    }
    static fromObject(o) {
        return new this(o);
    }
    static fromJSON(s) {
        return this.fromObject(JSON.parse(s));
    }
    async _call(pathname, data = {}, headers = {}) {
        return await (await (0, node_fetch_1.default)(this.constructor.BASE_URL + pathname + '?' + querystring_1.default.encode(Object.assign({
            customer: this.apiKey
        }, data)))).text();
    }
    async checkBalance() {
        const response = await this._call('/get_balance.php');
        return JSON.parse(response);
    }
    async checkRates({ country }) {
        const response = await this._call('/get_rates.php', {
            country
        });
        return JSON.parse(response);
    }
    async getHistory() {
        const response = await this._call('/get_history.php');
        return JSON.parse(response);
    }
    async getSms({ number, country, app }) {
        if (!number)
            number = (this.last || {}).number;
        if (!country)
            country = (this.last || {}).country;
        if (!app)
            app = (this.last || {}).app;
        const response = await this._call('/get_sms.php', {
            country,
            number,
            app
        });
        return response;
    }
    async getNumber({ app, country }) {
        const response = await this._call('/get_number.php', {
            app,
            country
        });
        return response;
    }
}
exports.SmsPinVerifyClient = SmsPinVerifyClient;
SmsPinVerifyClient.BASE_URL = "https://api.smspinverify.com/user";
//# sourceMappingURL=smspinverify.js.map