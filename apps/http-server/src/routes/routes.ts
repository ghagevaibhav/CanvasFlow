import express from 'express';
import userRouter from './userRouter.js';
import roomRouter from './roomRouter.js';
import { authMiddleware } from '../middleware/middleware.js';

const router: express.Router = express.Router();

router.use('/api/v1/user', userRouter);
router.use('/api/v1/room', roomRouter);

export default router;