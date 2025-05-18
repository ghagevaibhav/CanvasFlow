// import required dependencies
import express from 'express';
import { CreateRoomSchema } from '@repo/common/index';
import prisma from '@repo/db/index';
import { authMiddleware } from '../middleware/middleware.js';

// initialize router
const roomRouter: express.Router = express.Router();

// apply authentication middleware to all routes
roomRouter.use(authMiddleware);

// create a new room
roomRouter.post('/create', async (req, res) => {
    // validate request body
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.error(parsedData.error);
        res.status(400).json({ message: 'Invalid input data' });
        return;
    }
    try {
        // get user id from request
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return 
        }               
        // create new room in database
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

// get chat messages for a specific room
roomRouter.get('/chats/:roomId', async (req, res) => {
    // parse and validate room id
    const roomId = parseInt(req.params.roomId);
    if (isNaN(roomId)) {
        res.status(400).json({ message: 'Invalid room ID' });
        return;
    }
    try {
        // fetch messages from database
        const messages = await prisma.chat.findMany({
            where: { roomId: { equals: roomId } },
            orderBy: { id: 'desc' },
            take: 100
        });
        res.json({messages: messages});
        return;
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Something went wrong server side while fetching chats' });
        return;
    }
})

// get room details by slug
roomRouter.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    try{
        // find room in database
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
        return;
    }
})

export default roomRouter;