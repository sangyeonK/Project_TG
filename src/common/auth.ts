import * as crypto from 'crypto';
import config from './config';

const key = crypto.createHash('md5').update(config.auth.sessionBaseKey).digest();
const iv = crypto.createHash('md5').update(key).digest();

export function encrypt(inObject: any): string {
  if (inObject === undefined) {
    return undefined;
  }
  let result: string = undefined;
  const data = new Buffer(JSON.stringify(inObject), 'utf8');
  try {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    const encodedBuff = Buffer.concat([cipher.update(data), cipher.final()]);
    const encodedText = encodedBuff.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    result = encodedText;
  } catch (err) {
    result = undefined;
  }
  return result;

}

export function decrypt(inText: string): Object {
  if (inText === undefined) {
    return undefined;
  }
  let result: Object = undefined;
  const text = inText.replace(/\-/g, '+').replace(/_/g, '/');
  const edata = new Buffer(text, 'base64');
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    const decodedBuff = Buffer.concat([decipher.update(edata), decipher.final()]);
    const decodedObj = JSON.parse(decodedBuff.toString('utf8'));
    result = decodedObj;
  } catch (err) {
    result = undefined;
  }
  return result;
}
