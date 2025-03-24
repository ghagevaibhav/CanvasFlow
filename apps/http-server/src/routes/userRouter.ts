import express from 'express';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const { CreateUserSchema, SigninSchema } = await import('@repo/common/index');
const { JWT_SECRET } = await import("@repo/backend-common/index");
import prisma from '@repo/db/index';

const userRouter: express.Router = express.Router();

userRouter.post('/signup', async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.error(parsedData.error);
        res.status(400).json({ message: 'Invalid input data' });
        return;
    }

    try {
        // check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: parsedData.data.username },
        });

        if (existingUser) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        // hash the password and create the user
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
            },
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })

        res.status(201).json({
            userId: user.id,
            token,
            message: 'User signed up successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
        return;
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }
});
userRouter.post('/signin', async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.error(parsedData.error);
        res.status(400).json({ message: 'Invalid input data' });
        return;
    }

    try {
        const { username, password } = parsedData.data;

        const user = await prisma.user.findUnique({
            where: { email: username }
        });
        if (!user || !user.password) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        const passwordMatch = await bcrypt.compare(password.toString(), user.password.toString());
        if (!passwordMatch) {
            res.status(401).json({ message: 'Invalid Password', same: passwordMatch.toString()});
            return;
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.json({
            userId: user.id,
            message: 'User logged in successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
    return;
})

export default userRouter;