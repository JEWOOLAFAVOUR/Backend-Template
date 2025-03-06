import { Document } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ErrorResponse {
  success: boolean;
  error: boolean;
  message: string;
}

export interface CustomRequest extends Request {
  user?: JwtPayload | null;
  userId?: string;
}
