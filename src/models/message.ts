export interface Message {
  /** 메세지 sequence */
  seq: number;
  /** 메세지를 보낸 유저이름 */
  sender_name: string;
  /** 메세지를 보낸 유저의 accountSeq */
  sender_account_seq: number;
  /** 메세지를 보낸 유저의 소속 */
  sender_company: string;
  /** 메세지를 보낸 유저의 사진 */
  sender_picture: string;
  /** 메세지를 보낸 유저의 전문직종 코드 */
  sender_profession_code: string;
  /** 메세지 내용 */
  message: string;
  /** 메세지를 받은 date-time( UTC+0시 기준 ) */
  received_timestamp: string;
  /** 메세지 확인/미확인 여부. 미확인 일시 1 */
  is_new: boolean;
  /** 마지막 메세지 여부. 마지막 메세지 일시 1 */
  is_last: boolean;
}
