export interface ICachePosition {
  id: string;
  position_name: string;
  role: {
    role_name: string;
  };
}

export interface ICacheRole {
  id: string;
  role_name: string;
}

export interface IRolePositionPairPayload {
  role_name: string;
  position_name: string;
}

export type TLoggedInUser = NonNullable<Express.Request["user"]>;
