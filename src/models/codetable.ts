export interface ProfessionCode {
  /** 전문직종 코드값 */
  code: string;
  /** 전문직종 코드의미 */
  description: string;
}

export interface SpecialityCategory {
  /** 해당 전문분야 분류를 소유하는 전문직종 코드값 */
  profession_code: string;
  /** 전문분야 분류코드값 */
  code: string;
  /** 전문분야 분류코드의미 */
  description: string;
}

export interface Speciality {
  /** 해당 전문분야 를 소유하는 전문분야 분류코드값 */
  specialityCategory_code: string;
  /** 전문분야 코드값 */
  code: string;
  /** 전문분야 코드의미 */
  description: string;
}

export interface CodeTable {
  profession_codes: ProfessionCode[];
  specialityCategory_codes: SpecialityCategory[];
  speciality_codes: Speciality[];
}
