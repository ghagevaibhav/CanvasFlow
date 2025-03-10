import express from 'express';
import { authMiddleware } from '../middleware/middleware.js';
import { CreateRoomSchema } from '@repo/common/index';
import { prisma } from '@repo/db/index';

const roomRouter: express.Router = express.Router();

roomRouter.post('/create', authMiddleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.error(parsedData.error);
        res.status(400).json({ message: 'Invalid input data' });
        return;
    }
    try{
        console.log('User ID:', req.userId);
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return 
        }               
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId as string
            }
        })
        res.status(201).json({ message: 'Room created successfully', roomId: room.id});
        return;
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: 'Something went wrong server side' });
    }
})

roomRouter.get('/chats/:roomId', async (req, res) => {
    const roomId = parseInt(req.params.roomId);
    if (isNaN(roomId)) {
        res.status(400).json({ message: 'Invalid room ID' });
        return 
    }
    try {
        const messages = await prisma.chat.findMany({
            where: {
                roomId: {
                    equals: roomId
                }
            },
            orderBy: {
                id: 'desc'
            },
            take: 100
        });
        res.json({messages: messages});
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong server side while fetching chats' });
    }
})

roomRouter.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    try{
        const room = await prisma.room.findUnique({
            where: {
                slug: slug
            }
        })
        res.json({room});
        return;
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: 'Something went wrong server side' });
    }
})

export default roomRouter;