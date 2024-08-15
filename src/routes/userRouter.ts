import { Router } from 'express';
import userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.post('/getuserdata', userController.getUserData);
userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login);
userRouter.get('/auth', authMiddleware, userController.check);
userRouter.post('/edituser', userController.editUser);
userRouter.post('/changepassword', userController.changePassword);

export default userRouter;
