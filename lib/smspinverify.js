"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsPinVerifyClient = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const gzip_js_1 = require("gzip-js");
class SmsPinVerifyClient {
    constructor(o) {
        this.apiKey = o.apiKey;
    }
    toObject() {
        return {
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
        const response = await axios_1.default.get(this.constructor.BASE_URL + pathname + '?' + querystring_1.default.encode(Object.assign({
            customer: this.apiKey
        }, data)), {
            headers: {
            //	'Accept-Encoding': 'gzip, deflate, br'
            },
            responseType: 'arraybuffer'
        });
        return Object.assign({}, response, { data: Buffer.from((0, gzip_js_1.unzip)(response.data)).toString('utf8') });
    }
    async checkBalance() {
        const response = await this._call('/get_balance.php');
        return response.data;
    }
    async checkRates({ country }) {
        const response = await this._call('/get_rates.php', {
            country
        });
        return response.data;
    }
    async getHistory() {
        const response = await this._call('/get_history.php');
        return response.data;
    }
    async getSms({ number, country, app }) {
        const response = await this._call('/get_sms.php', {
            country,
            number,
            app
        });
        return response.data;
    }
    async getNumber({ app, country }) {
        const response = await this._call('/get_number.php', {
            app,
            country
        });
        return response.data;
    }
}
exports.SmsPinVerifyClient = SmsPinVerifyClient;
SmsPinVerifyClient.BASE_URL = "https://api.smspinverify.com/user";
//# sourceMappingURL=smspinverify.js.map