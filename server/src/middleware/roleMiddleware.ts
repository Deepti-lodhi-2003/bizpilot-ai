import { type Response, type NextFunction } from "express";
import { type AuthenticatedRequest } from "./authMiddleware.js";

export const authorize = (...allowedRoles: string[]) => {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });

            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "Access forbidden",
            });

            return;
        }

        next();
    };
};