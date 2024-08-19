import { Router } from 'express';
import userRouter from './userRouter';
import ordersRouter from './ordersRouter';

const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/orders', ordersRouter);

export default mainRouter;
