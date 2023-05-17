import fetch from "node-fetch";
import qs from 'querystring';
import { unzip } from "gzip-js";

export class SmsPinVerifyClient {
  static BASE_URL = "https://api.smspinverify.com/user";
  public apiKey: string;
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
  static fromJSON(s){
    return this.fromObject(JSON.parse(s));
  }
  async _call(pathname, data = {}, headers = {}) {
    return await (await fetch((this.constructor as any).BASE_URL + pathname + '?' + qs.encode(Object.assign({
      customer: this.apiKey
    }, data)))).text()
  }
  async checkBalance() {
    const response = await this._call('/get_balance.php');
    return JSON.parse(response);
  }
  async checkRates({
    country
  }) {
    const response = await this._call('/get_rates.php', {
      country 
    });
    return JSON.parse(response);
  }
  async getHistory() {
    const response = await this._call('/get_history.php');
    return JSON.parse(response);
  }
  async getSms({
    number,
    country,
    app
  }) {
    const response = await this._call('/get_sms.php', {
      country,
      number,
      app
    });
    return response;
  }
  async getNumber({
    app,
    country
  }) {
    const response = await this._call('/get_number.php', {
      app,
      country
    });
    return response;
  }
}
