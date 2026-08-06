import { type Request } from "express";

export interface OrderRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}