import { type Request } from "express";
import { type AuthUser } from "./types.js";

export interface UserRequest extends Request {
  user?: AuthUser;
}