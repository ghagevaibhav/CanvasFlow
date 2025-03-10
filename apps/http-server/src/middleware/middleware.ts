import { JWT_SECRET } from "@repo/backend-common/index";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            res.status(401).json({
                message: "Token is not provided!",
                success: false
            })
            return
        }
        jwt.verify(token, JWT_SECRET, function (err, data) {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized",
                    success: false,
                })
            }
            if (typeof data !== "string") {
                req.userId = data?.id;
                console.log(data)
            }
            next()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong server side",
            success: false
        })
    }
}