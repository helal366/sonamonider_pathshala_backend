import { EducationDegree } from "#db-client";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";



export type TMotherDetailsPatchService = (
  payload: never,
  loggedInUser: TLoggedInUser,
) => Promise<unknown>;

export interface ITargetUser {
  id: string;
  full_name: string;
  mother_details_id: string | null;
  mother_details: IMotherDetails | null;
};

export interface IMotherDetails {
  id: string;
  mother_name: string;
  nid_no: string | null;
  occupation: string | null;
  job_title: string | null;
  educational_qualification: EducationDegree | null;
  monthly_income: string | null;
  mobile_no_1: string | null;
  mobile_no_2: string | null;
  mobile_no_3: string | null;
};