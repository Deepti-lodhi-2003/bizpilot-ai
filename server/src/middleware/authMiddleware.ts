import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { type AuthUser } from "./types.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const protect = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });

            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Invalid authorization header",
            });

            return;
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({
                success: false,
                message: "JWT secret is not configured",
            });

            return;
        }

        const decoded = jwt.verify(token, jwtSecret);

        if (typeof decoded === "string") {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });

            return;
        }

        req.user = {
            userId: decoded.userId as string,
            role: decoded.role as string,
        };

        next();
    } catch (error) {
        console.error("JWT verification failed:", error);

        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};