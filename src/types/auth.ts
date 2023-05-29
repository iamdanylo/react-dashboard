import { UserType } from "models/member";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type CurrentUserResponse = {
    _id: string;
    userType: UserType,
    email: string;
    passwordHash: string;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
};
