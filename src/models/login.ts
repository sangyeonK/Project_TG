export interface Login {
  /** resource 접근을 위해 사용하는 access_token */
  access_token: string;
}

export interface RequestLogin {
  /** 플랫폼 종류 */
  platform: string;
  /** 플랫폼에서 제공한 사용자 식별 코드 */
  code?: string;
  /** 자체 플랫폼(TG) 에 로그인 할 때 사용할 ID */
  id?: string;
  /** 자체 플랫폼(TG) 에 로그인 할 때 사용할 PASSWORD */
  password?: string;
}
