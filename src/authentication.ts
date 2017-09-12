import * as express from 'express';
import logger from './common/logger';
import { decrypt } from './common/auth';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  const token = request.header('access_token');

  const authInfo = decrypt(token);

  // TODO - authInfo.time 값이 오래전 값이면 실패처리..

  if (authInfo) {
    return Promise.resolve({
      accountSeq: 1
    });
  } else {
    return Promise.reject({
      message: 'The access token is invalid'
    });
  }

};
