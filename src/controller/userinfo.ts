import { ServerRequest } from 'http';
import { waterfall } from 'async';
import { Route, Request, Tags, Get, Put, Path, Body, BodyProp } from 'tsoa';
import * as formidable from 'formidable';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import * as pad from 'pad';

import * as Mysql from '../common/mysql';
import DBquerys from '../common/define/query';
import { ResponseUserInfo, RequestUpdateUserInfo } from '../models/userinfo';
import logger from '../common/logger';
import config from '../common/config';

@Route('userinfo')
export class UserInfoController {

  /**
   * 사용자 정보 얻어오기
   * @param accountSeq 얻어올 사용자의 accountSeq
   */
  @Tags('UserInfo')
  @Get('{accountSeq}')
  public async getUserInfo( @Path('accountSeq') accountSeq: number): Promise<ResponseUserInfo> {

    return new Promise<ResponseUserInfo>((resolve: (value: ResponseUserInfo) => void, reject: (reaseon) => void) => {
      let connection: Mysql.IConnection;
      let response: ResponseUserInfo;

      waterfall(
        [
          function (cb: (err, conn) => any) {
            Mysql.getConnection(cb);
          },
          function cb(conn: Mysql.IConnection, cb: (err, result, fields) => any) {
            connection = conn;
            connection.query(DBquerys.get_user_info, [accountSeq], cb);
          },
          function cb(result, fields, cb: (err, result, fields) => any) {

            if (result.length === 0) {
              return cb(-1, undefined, undefined);
            }

            response = {
              account_seq: result[0]['account_seq'],
              name: result[0]['name'],
              profession_code: result[0]['profession_code'],
              speciality_code: [],
              company: result[0]['company'],
              email: result[0]['email'],
              phone: result[0]['phone'],
              area: result[0]['area'],
              introduce: result[0]['introduce'],
              experience: result[0]['experience'],
              picture: {
                id: `${config.aws.picture_cloudfront_domain}/${result[0]['picture']}`,
                intro: `${config.aws.picture_cloudfront_domain}/${result[0]['picture']}`
              }
            };

            connection.query(DBquerys.get_user_speciality, [accountSeq], cb);
          },
          function cb(result, fields, cb: (err, result, fields) => any) {
            result.forEach(function (value, index, array) {
              response.speciality_code.push(value['speciality_code']);
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
          resolve(response);
        });
    });
  }

  /**
   * 사용자 정보 수정하기
   * 
   * Body Parameter에 수정하고 싶은 항목들만 입력한다.
   * 
   * 응답은 수정된 항목들만 준다.
   * @param accountSeq 얻어올 사용자의 accountSeq
   * @param requestUpdateUserInfo 수정할 데이터
   */
  @Tags('UserInfo')
  @Put('{accountSeq}')
  public async updateUserInfo( @Path('accountSeq') accountSeq: number,
    @Body() requestUpdateUserInfo: RequestUpdateUserInfo, @Request() request: any): Promise<ResponseUserInfo> {

    return new Promise<ResponseUserInfo>((resolve: (value: ResponseUserInfo) => void, reject: (reaseon) => void) => {
      let connection: Mysql.IConnection;
      let response: ResponseUserInfo = {
        account_seq: accountSeq
      };

      const professionCode = requestUpdateUserInfo.professionCode;
      const specialityCodes = requestUpdateUserInfo.specialityCode;
      const company = requestUpdateUserInfo.company;
      const phone = requestUpdateUserInfo.phone;
      const email = requestUpdateUserInfo.email;
      const area = requestUpdateUserInfo.area;
      const introduce = requestUpdateUserInfo.introduce;
      const experience = requestUpdateUserInfo.experience;

      if (professionCode) response.profession_code = professionCode;
      if (specialityCodes) response.speciality_code = specialityCodes;
      if (company) response.company = company;
      if (phone) response.phone = phone;
      if (email) response.email = email;
      if (area) response.area = area;
      if (introduce) response.introduce = introduce;
      if (experience) response.experience = experience;

      waterfall(
        [
          function (cb: (err, conn) => any) {
            Mysql.getConnection(cb);
          },
          function cb(conn: Mysql.IConnection, cb: (err, result, fields) => void) {
            connection = conn;
            let updateExpr = Mysql.makeUpdateExpr({ company: company, phone: phone, email: email, area: area, introduce: introduce, experiance: experience });
            if (updateExpr !== undefined) {
              connection.query(DBquerys.update_user_account, [updateExpr, accountSeq], cb);
            } else {
              cb(undefined, undefined, undefined);
            }
          },
          function cb(result, fields, cb: (err, result, fields) => void) {
            if (professionCode !== undefined) {
              // 전문직종 업데이트
              connection.query(DBquerys.update_user_profession_code, [professionCode, accountSeq], cb);
            } else {
              cb(undefined, undefined, undefined);
            }
          },
          function cb(result, fields, cb: (err) => void) {
            if (specialityCodes !== undefined && Array.isArray(specialityCodes) && specialityCodes.length > 0) {
              // 전문분야 업데이트 - 기존 보유데이터 삭제 후 추가
              waterfall(
                [
                  // step 1. 전문분야 코드 삭제
                  function (cbUpdateSpeciality: (err: Error) => void) {
                    connection.query(DBquerys.delete_speciality_code, [accountSeq], cbUpdateSpeciality);
                  },
                  // step 2. 전문분야 코드 추가
                  function (result2, fields2, cbUpdateSpeciality: (err: Error) => void) {
                    let values: string[][] = [];
                    specialityCodes.forEach(function (value: string, index: number, array: string[]) {
                      values.push([String(accountSeq), value]);
                    });
                    connection.query(DBquerys.insert_user_speciality_code, [values], cbUpdateSpeciality);
                  },
                ], function final(err: Error) {
                  if (err) { return cb(err); }

                  cb(undefined);
                }
              );
            } else {
              cb(undefined);
            }

          },
        ],
        function final(err: Error) {
          if (connection) {
            connection.release();
          }
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
    });
  }


  /**
     * 사용자 사진 수정하기
     * 
     * Content-Type: multipart/form-data 방식으로 파일을 업로드 해야한다.
     * 
     * form-key 는 'file' 을 사용한다.
     * 
     * 응답은 수정된 사진URL 을 준다.( 그외 항목은 생략됨 )
     * @param accountSeq 사진을 수정할 사용자의 accountSeq
     */
  @Tags('UserInfo')
  @Put('picture/{accountSeq}')
  public async updateUserPicture( @Path('accountSeq') accountSeq: number,
    @Request() request: ServerRequest): Promise<ResponseUserInfo> {

    return new Promise<ResponseUserInfo>((resolve: (value: ResponseUserInfo) => void, reject: (reaseon) => void) => {
      let file: formidable.File;
      let form = new formidable.IncomingForm();

      form.parse(request, function (err, fields: formidable.Fields, files: formidable.Files) {
        file = files.file;
      });

      form.on('error', (err) => {
        logger.error(err);
      });

      form.on('end', (err) => {
        if (!file || file.size === 0)
          return reject(-2);

        let connection: Mysql.IConnection;
        let response: ResponseUserInfo = {
          account_seq: accountSeq
        };
        let oldImagePath: string, newImagePath: string;
        const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

        waterfall(
          [
            function (cb: (err, conn) => any) {
              Mysql.getConnection(cb);
            },
            function cb(conn: Mysql.IConnection, cb: (err, result, fields) => void) {
              connection = conn;
              connection.query(DBquerys.get_user_info, [accountSeq], cb);
            },
            function cb(result, fields, cb: (err, data) => void) {
              if (result.length === 0)
                return cb(-1, undefined);

              oldImagePath = result[0]['picture'];
              newImagePath = `images/${pad(2, accountSeq % 100, '0')}/${accountSeq}_${path.basename(file.path)}`;
              //png 혹은 jpg 파일만 입력될 것이라고 가정..나중에 변경될  여지는 있음
              if (file.type.search('png') !== -1)
                newImagePath += `.png`;
              else
                newImagePath += `.jpg`;

              let fileStream = fs.createReadStream(file.path);
              fileStream.on('error', (err) => {
                logger.error(err);
              });

              let uploadParams: AWS.S3.Types.PutObjectRequest = {
                Bucket: config.aws.picture_s3_bucket,
                Key: newImagePath,
                Body: fileStream,
                ContentType: file.type
              };

              s3.upload(uploadParams, cb);
            },
            function cb(data, cb: () => any) {
              connection.query(DBquerys.update_user_picture, [newImagePath, accountSeq], cb);
            },
            function cb(results, fields, cb: (err) => void) {
              //업로드 한 임시파일 삭제
              fs.unlink(file.path, cb);
            },
            function cb(cb: (err) => void) {
              let deleteParams: AWS.S3.Types.DeleteObjectRequest = {
                Bucket: config.aws.picture_s3_bucket,
                Key: oldImagePath
              }

              s3.deleteObject(deleteParams, cb);
            }
          ],
          function final(err: Error) {
            if (connection) {
              connection.release();
            }
            if (err) {
              return reject(err);
            }

            response.picture = {
              id: `${config.aws.picture_cloudfront_domain}/${newImagePath}`,
              intro: `${config.aws.picture_cloudfront_domain}/${newImagePath}`
            }
            resolve(response);
          });
      });
    });
  }

}

