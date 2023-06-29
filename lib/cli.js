"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = exports.loadFiles = exports.loadSessionFrom = exports.saveSessionAs = exports.callAPI = exports.loadSession = exports.initSession = exports.saveSession = void 0;
const smspinverify_1 = require("./smspinverify");
const yargs_1 = __importDefault(require("yargs"));
const change_case_1 = require("change-case");
const fs_extra_1 = __importDefault(require("fs-extra"));
require("setimmediate");
const mkdirp_1 = require("mkdirp");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const logger = (0, logger_1.getLogger)();
async function saveSession(smspinverify, json = false, filename = 'session.json') {
    await (0, mkdirp_1.mkdirp)(path_1.default.join(process.env.HOME, '.smspinverify'));
    await fs_extra_1.default.writeFile(path_1.default.join(process.env.HOME, '.smspinverify', filename), smspinverify.toJSON());
    if (!json)
        logger.info('saved to ~/' + path_1.default.join('.smspinverify', filename));
}
exports.saveSession = saveSession;
async function initSession({ apiKey }) {
    const smspinverify = new smspinverify_1.SmsPinVerifyClient({ apiKey: apiKey || process.env.SMSPINVERIFY_API_KEY });
    await saveSession(smspinverify);
}
exports.initSession = initSession;
async function loadSession() {
    return smspinverify_1.SmsPinVerifyClient.fromJSON(await fs_extra_1.default.readFile(path_1.default.join(process.env.HOME, '.smspinverify', 'session.json')));
}
exports.loadSession = loadSession;
async function callAPI(command, data) {
    const smspinverify = await loadSession();
    const camelCommand = (0, change_case_1.camelCase)(command);
    const json = data.j || data.json;
    delete data.j;
    delete data.json;
    if (!smspinverify[camelCommand])
        throw Error('command not foud: ' + command);
    const result = await smspinverify[camelCommand](data);
    if (json)
        console.log(JSON.stringify(result, null, 2));
    else
        logger.info(result);
    return result;
}
exports.callAPI = callAPI;
async function saveSessionAs(name) {
    const smspinverify = await loadSession();
    await saveSession(smspinverify, false, name + '.json');
}
exports.saveSessionAs = saveSessionAs;
async function loadSessionFrom(name) {
    const smspinverify = smspinverify_1.SmsPinVerifyClient.fromObject(require(path_1.default.join(process.env.HOME, '.smspinverify', name)));
    await saveSession(smspinverify);
}
exports.loadSessionFrom = loadSessionFrom;
async function loadFiles(data) {
    const fields = [];
    for (let [k, v] of Object.entries(data)) {
        const parts = /(^.*)FromFile$/.exec(k);
        if (parts) {
            const key = parts[1];
            fields.push([key, await fs_extra_1.default.readFile(v)]);
        }
        else {
            fields.push([k, v]);
        }
    }
    return fields.reduce((r, [k, v]) => {
        r[k] = v;
        return r;
    }, {});
}
exports.loadFiles = loadFiles;
async function runCLI() {
    const [command] = yargs_1.default.argv._;
    const options = Object.assign({}, yargs_1.default.argv);
    delete options._;
    const data = await loadFiles(Object.entries(options).reduce((r, [k, v]) => {
        r[(0, change_case_1.camelCase)(k)] = String(v);
        return r;
    }, {}));
    switch (command) {
        case 'init':
            return await initSession({
                apiKey: yargs_1.default.argv._[1]
            });
            break;
        case 'save':
            return await saveSessionAs(yargs_1.default.argv._[1]);
            break;
        case 'load':
            return await loadSessionFrom(yargs_1.default.argv._[1]);
            break;
        default:
            return await callAPI(yargs_1.default.argv._[0], data);
            break;
    }
}
exports.runCLI = runCLI;
//# sourceMappingURL=cli.js.map