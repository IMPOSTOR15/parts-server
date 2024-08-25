import { Router } from 'express';
import frozaController from '../controllers/frozaController';

const frozaRouter = Router();

frozaRouter.post('/get_orders_given_out', frozaController.getOrdersGivenOut);

export default frozaRouter;
