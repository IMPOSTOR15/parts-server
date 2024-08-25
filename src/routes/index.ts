import { Router } from 'express';
import userRouter from './userRouter';
import ordersRouter from './ordersRouter';
import frozaRouter from './frozaRoutes';

const mainRouter = Router();

mainRouter.use('/user', userRouter);
mainRouter.use('/orders', ordersRouter);
mainRouter.use('/froza', frozaRouter);

export default mainRouter;
