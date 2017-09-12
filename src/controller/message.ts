import {waterfall} from 'async';
import {Route, Tags, Get, Path, Query} from 'tsoa';

import * as Mysql from '../common/mysql';
import DBquerys from '../common/define/query';
import config from '../common/config';
import {Message} from '../models/message';

@Route('message')
export class MessageController {
  /**
   * 사용자 메세지목록 얻어오기
   * @param accountSeq 메세지 목록을 얻어올 유저의 accountSeq
   * @param lastSeq 특정 message_seq 이전 메세지를 보고싶을때 ( 입력한 message_seq 이후의 메세지 목록을 반환 )
   */
  @Tags('Message')
  @Get('{accountSeq}')
  public async getMessages( @Path('accountSeq') accountSeq: number,
    @Query('lastSeq') reqLastSeq?: number): Promise<Message[]> {

    return new Promise<Message[]>((resolve: (value: Message[]) => void, reject: (reaseon) => void) => {
      let connection: Mysql.IConnection;
      let lastSeq: number;

      let messages: Message[] = [];

      waterfall(
        [
          function(cb: (err, conn) => any) {
            Mysql.getConnection(cb);
          },
          function cb(conn: Mysql.IConnection, cb: (err, result, fields) => any) {
            connection = conn;
            connection.query(DBquerys.get_user_message_lastSeq, [accountSeq], cb);
          },
          function cb(result, fields, cb: (err, result, fields) => any) {
            if (result.length === 0) {
              return cb(-1, undefined, undefined);
            }

            lastSeq = result[0]['seq'];

            if (reqLastSeq !== undefined) {
              connection.query(DBquerys.get_user_messages__with_lastSeq, [accountSeq, reqLastSeq], cb);
            } else {
              connection.query(DBquerys.get_user_messages, [accountSeq], cb);
            }
          },
          function cb(result, fields, cb: (err, result, fields) => any) {
            result.forEach(function(value, index, array) {
              const message: Message = {
                seq: value['seq'],
                sender_name: value['sender_name'],
                sender_account_seq: value['sender_account_seq'],
                sender_company: value['sender_company'],
                sender_picture: `${config.aws.picture_cloudfront_domain}/${value['sender_picture']}`,
                sender_profession_code: value['sender_profession_code'],
                message: value['message'],
                received_timestamp: value['received_timestamp'],
                is_new: Boolean(value['is_new']),
                is_last: value['seq'] === lastSeq
              };

              messages.push(message);
            });
            cb(undefined, undefined, undefined);
          },
        ],
        function final(err: Error) {
          if (connection) {
            connection.release();
          }
          if (err) {
            return reject(JSON.stringify(err));
          }
          return resolve(messages);
        });
    });
  }

  /**
   * 사용자 메세지 얻어오기
   * @param 메세지의 유저accountSeq
   * @param 메세지의 messageSeq
   */
  @Tags('Message')
  @Get('{accountSeq}/{messageSeq}')
  public async getMessage( @Path('accountSeq') accountSeq: number,
    @Path('messageSeq') messageSeq: number): Promise<Message> {

    return new Promise<Message>((resolve: (value: Message) => void, reject: (reaseon) => void) => {
      let connection: Mysql.IConnection;
      let lastSeq: number;

      let message: Message;
      waterfall(
        [
          function(cb: (err, conn) => any) {
            Mysql.getConnection(cb);
          },
          function cb(conn: Mysql.IConnection, cb: (err, result, fields) => any) {
            connection = conn;
            connection.query(DBquerys.get_user_message_lastSeq, [accountSeq], cb);
          },
          function cb(result, fields, cb: (err, result, fields) => any) {
            if (result.length === 0) {
              return cb(-1, undefined, undefined);
            }

            lastSeq = result[0]['seq'];
            connection.query(DBquerys.get_user_message, [accountSeq, messageSeq], cb);
          },
          function cb(result, fields, cb: (err, result, fields) => any) {
            if (result.length === 0) {
              return cb(-1, undefined, undefined);
            }

            message = {
              seq: result[0]['seq'],
              sender_name: result[0]['sender_name'],
              sender_account_seq: result[0]['sender_account_seq'],
              sender_company: result[0]['sender_company'],
              sender_picture:  `${config.aws.picture_cloudfront_domain}/${result[0]['sender_picture']}`,
              sender_profession_code: result[0]['sender_profession_code'],
              message: result[0]['message'],
              received_timestamp: result[0]['received_timestamp'],
              is_new: Boolean(result[0]['is_new']),
              is_last: result[0]['seq'] === lastSeq
            };

            if (message.is_new) {
              connection.query(DBquerys.update_user_message_to_be_seen, [accountSeq, messageSeq], cb);
            } else {
              cb(undefined, undefined, undefined);
            }
          },
          function cb(result, fields, cb: (err, result, fields) => any) {
            cb(undefined, undefined, undefined);
          }
        ],
        function final(err: Error) {
          if (connection) {
            connection.release();
          }
          if (err) {
            return reject(err);
          }
          return resolve(message);
        });
    });
  }

}
