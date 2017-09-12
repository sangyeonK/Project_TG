import {waterfall} from 'async';
import {Route, Body, Post, Tags} from 'tsoa';

import {encrypt} from '../common/auth';
import {Login, RequestLogin} from '../models/login';

@Route('login')
export class LoginController {
  /**
   * 로그인 하기
   * @param requestLogin 로그인 시 필요한 데이터
   */
  @Tags('Account')
  @Post()
  public async login( @Body() requestLogin: RequestLogin): Promise<Login> {

    return new Promise<Login>((resolve: (value: Login) => void, reject: (reaseon) => void) => {
      let login: Login;

      waterfall(
        [
          function(cb: (err) => any) {
            let accessToken: string = encrypt({
              id: requestLogin.id,
              time: Date.now() / 1000
            });
            login = {
              access_token: accessToken
            };

            return cb(undefined);
          },
        ],
        function final(err: Error) {
          if (err) {
            return reject(err);
          }
          return resolve(login);
        });
    });
  }
}
