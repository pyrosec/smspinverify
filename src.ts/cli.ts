import { SmsPinVerifyClient } from "./smspinverify";
import yargs from "yargs";
import { camelCase } from "change-case";
import fs from "fs-extra";
import util from "util";
import "setimmediate";
import { mkdirp } from "mkdirp"
import path from "path";
import { getLogger } from "./logger";

const logger = getLogger();

export async function saveSession(smspinverify, json = false, filename = 'session.json') {
  await mkdirp(path.join(process.env.HOME, '.smspinverify'));

  await fs.writeFile(path.join(process.env.HOME, '.smspinverify', filename), smspinverify.toJSON());
  if (!json) logger.info('saved to ~/' + path.join('.smspinverify', filename));
}
  

export async function initSession({
  apiKey
}) {
  const smspinverify = new SmsPinVerifyClient({ apiKey: apiKey || process.env.SMSPINVERIFY_API_KEY });
  await saveSession(smspinverify);
}

export async function loadSession() {
  return SmsPinVerifyClient.fromJSON(await fs.readFile(path.join(process.env.HOME, '.smspinverify', 'session.json')));
}

export async function callAPI(command, data) {
  const smspinverify = await loadSession();
  const camelCommand = camelCase(command);
  const json = data.j || data.json;
  delete data.j
  delete data.json;
  if (!smspinverify[camelCommand]) throw Error('command not foud: ' + command);
  const result = await smspinverify[camelCommand](data);
  if (camelCommand === 'getNumber') await saveSession(smspinverify);
  if (json) console.log(JSON.stringify(result, null, 2));
  else logger.info(result);
  return result;
}

export async function saveSessionAs(name) {
  const smspinverify = await loadSession();
  await saveSession(smspinverify, false, name + '.json');
}

export async function loadSessionFrom(name) {
  const smspinverify = SmsPinVerifyClient.fromObject(require(path.join(process.env.HOME, '.smspinverify', name)));
  await saveSession(smspinverify);
}
  
export async function loadFiles(data: any) {
  const fields = [];
  for (let [ k, v ] of Object.entries(data)) {
    const parts = /(^.*)FromFile$/.exec(k);
    if (parts) {
      const key = parts[1];
      fields.push([key, await fs.readFile(v)]);
    } else {
      fields.push([k, v]);
    }
  }
  return fields.reduce((r, [k, v]) => {
    r[k] = v;
    return r;
  }, {});
}
      

export async function runCLI() {
  const [ command ] = yargs.argv._;
  const options = Object.assign({}, yargs.argv);
  delete options._;
  const data = await loadFiles(Object.entries(options).reduce((r, [ k, v ]) => {
    r[camelCase(k)] = String(v);
    return r;
  }, {}));
  switch (command) {
    case 'init':
      return await initSession({
        apiKey: yargs.argv._[1]
      });
      break;
    case 'save':
      return await saveSessionAs(yargs.argv._[1]);
      break;
    case 'load':
      return await loadSessionFrom(yargs.argv._[1]);
      break;
    default: 
      return await callAPI(yargs.argv._[0], data);
      break;
  }
}
