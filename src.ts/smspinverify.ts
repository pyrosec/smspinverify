import axios from "axios";
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
    const response = await axios.get((this.constructor as any).BASE_URL + pathname + '?' + qs.encode(Object.assign({
      customer: this.apiKey
    }, data)), {
      headers: {
//	'Accept-Encoding': 'gzip, deflate, br'

      },
      responseType: 'arraybuffer'
    });
    return Object.assign({}, response, { data: Buffer.from(unzip(response.data)).toString('utf8') });
  }
  async checkBalance() {
    const response = await this._call('/get_balance.php');
    return response.data;
  }
  async checkRates({
    country
  }) {
    const response = await this._call('/get_rates.php', {
      country 
    });
    return response.data;
  }
  async getHistory() {
    const response = await this._call('/get_history.php');
    return response.data;
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
    return response.data;
  }
  async getNumber({
    app,
    country
  }) {
    const response = await this._call('/get_number.php', {
      app,
      country
    });
    return response.data;
  }
}
