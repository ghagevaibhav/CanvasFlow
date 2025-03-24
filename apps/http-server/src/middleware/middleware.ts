import { JWT_SECRET } from "@repo/backend-common/index";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "@repo/db/index";

interface DecodedToken {
    id: string;
    [key: string]: any;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            res.status(401).json({
                message: "Authentication required",
                success: false
            });
            return;
        }

        // verify token
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        console.log(decoded)
        
        // verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            res.status(401).json({
                message: "User not found",
                success: false
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: "Token expired",
                success: false
            });
            return;
        }
        
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: "Invalid token",
                success: false
            });
            return;
        }

        res.status(500).json({
            message: "Internal server error",
            success: false
        });
        return;
    }
};