import { type Response } from "express";
import { type AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const getProfile = ( req: AuthenticatedRequest,  res: Response ): void => {

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
};