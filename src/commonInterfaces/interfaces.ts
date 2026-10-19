export interface ICachePosition {
  id: string;
  position_name: string;
}

export interface ICacheRole {
  id: string;
  role_name: string;
}


export interface ICacheRole {
  id: string;
  role_name: string;
}

export type TLoggedInUser = NonNullable<Express.Request["user"]>;

export const timeStringRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;
