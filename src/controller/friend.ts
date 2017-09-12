import {waterfall} from 'async';
import {Route, Tags, Get, Path, Query} from 'tsoa';

import * as Mysql from '../common/mysql';
import DBquerys from '../common/define/query';
import config from '../common/config';
import {Friend} from '../models/friend';

@Route('friend')
export class FriendController {
  /**
   * 친구 리스트 얻어오기
   * @param accountSeq 친구목록을 얻어올 사용자의 accountSeq
   * @param professionCode 특정 전문직종을 보유한 친구 리스트를 얻기 위해 입력하는 전문직종 코드
   */
  @Tags('Friend')
  @Get('{accountSeq}')
  public async getFriends( @Path('accountSeq') accountSeq: number,
    @Query('professionCode') professionCode?: string): Promise<Friend[]> {

    return new Promise<Friend[]>((resolve: (value: Friend[]) => void, reject: (reaseon) => void) => {
      let connection: Mysql.IConnection;
      let friends: Friend[] = [];

      waterfall(
        [
          function(cb: (err, conn) => any) {
            Mysql.getConnection(cb);
          },
          function cb(conn: Mysql.IConnection, cb: (err, result, fields) => any) {
            connection = conn;
            if (professionCode === undefined) {
              connection.query(DBquerys.get_user_friend, [accountSeq], cb);
            } else {
              connection.query(DBquerys.get_user_friend__with_professionCode, [accountSeq, professionCode], cb);
            }
          },
          function cb(result, fields, cb: (err, result, fields) => any) {
            result.forEach(function(value, index, array) {
              const friend: Friend = {
                seq: value['account_seq'],
                name: value['name'],
                picture: `${config.aws.picture_cloudfront_domain}/${value['picture']}`,
                profession_code: value['profession_code'],
                speciality_code: 'A0101',
                is_favorite: Boolean(value['account_seq'] % 2),
                is_new: Boolean((value['account_seq'] % 3) % 2)
              };

              friends.push(friend);
            });
            cb(undefined, undefined, undefined);
          },
        ],
        function final(err: Error) {
          if (connection) {
            connection.release();
          }
          if (err) {
            return reject(err);
          }
          return resolve(friends);
        });
    });
  }
}
