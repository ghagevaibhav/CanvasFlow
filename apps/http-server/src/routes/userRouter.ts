    import express from 'express';
    import bcrypt from "bcrypt"
    import jwt from "jsonwebtoken"
    const { CreateUserSchema, SigninSchema } = await import('@repo/common/index');
    const { JWT_SECRET } = await import("@repo/backend-common/index");
    const { prisma } = await import('@repo/db/index');

    const userRouter: express.Router = express.Router();

    userRouter.post('/signup', async (req, res) => {
        
        const parsedData = CreateUserSchema.safeParse(req.body);

        if (!parsedData.success) {
            console.error(parsedData.error);
            res.status(400).json({ message: 'Invalid input data' });
            return
        }

        try {
            bcrypt.hash(parsedData.data.password, 10, async (err, hashedPassword) =>{
                if(err) throw err;
                const user = await prisma.user.create({
                    data: {
                        email: parsedData.data.username,
                        password: hashedPassword,
                        name: parsedData.data.name,
                    },
                });
                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
                
                res.status(201).json({
                    userId: user.id,
                    token,
                    hashedPassword,
                    message: 'User Signed Up Successfully',
                });
            });
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
            console.log('Input password:', password);
            console.log('Stored hashed password:', user.password);

            const same = await bcrypt.compare(password.toString(), user.password.toString());
            if (!same) {
                res.status(401).json({ message: 'Invalid Password', same: same.toString()});
                return;
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({
                userId: user.id,
                token: token,
                message: 'User Logged In Successfully'
            });
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    export default userRouter;