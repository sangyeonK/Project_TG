interface UserInfoPicture {
  id: string;
  intro: string;
}

export interface ResponseUserInfo {
  account_seq: number;
  name?: string;
  /** 전문직종 코드 */
  profession_code?: string;
  /** 전문분야 코드 리스트 */
  speciality_code?: string[];
  company?: string;
  phone?: string;
  email?: string;
  area?: string;
  introduce?: string;
  experience?: string;
  picture?: UserInfoPicture;
}

export interface RequestUpdateUserInfo {
  /** 변경할 전문직종 코드 */
  professionCode?: string;
  /** 변경할 전문분야 코드 */
  specialityCode?: string[];
  /** 변경할 소속회사 */
  company?: string;
  /** 변경할 휴대폰번호 */
  phone?: string;
  /** 변경할 이메일주소 */
  email?: string;
  /** 변경할 활동지역 */
  area?: string;
  /** 변경할 자기소개 */
  introduce?: string;
  /** 변경할 주요경력 */
  experience?: string;
}
