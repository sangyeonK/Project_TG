export interface Friend {
  /** 친구의 accountSeq */
  seq: number;
  /** 친구의 이름 */
  name: string;
  /** 친구의 사진URL 주소 */
  picture: string;
  /** 친구의 전문직종 코드값 */
  profession_code: string;
  /** 친구의 전문분야 코드값(소분류) */
  speciality_code: string;
  /** 즐겨찾기 여부 ( 1 - 즐겨찾기 친구, 0 - 일반친구) */
  is_favorite: boolean;
  /** 신규친구 여부 ( 1 - 신규친구, 0 - 일반친구) */
  is_new: boolean;
}
