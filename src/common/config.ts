import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import logger from './logger';

const args = process.argv.slice(2);

let filename = undefined;
let config = undefined;

if (args.length === 1) {
  filename = args[0];
} else {
  filename = 'serverConfig.example.yml';
}

try {
  config = yaml.safeLoad(fs.readFileSync(`conf.server/${filename}`, 'utf8'));
  logger.info(`Server Configuration has been successfully load. - ${filename}`);
} catch (err) {
  logger.error(`Failed to load Server Configuration. - ${filename}`);
  logger.error(err);
}

AWS.config.accessKeyId = config.aws.accessKeyId;
AWS.config.secretAccessKey = config.aws.secretAccessKey;
AWS.config.region = config.aws.region;

export default config;
