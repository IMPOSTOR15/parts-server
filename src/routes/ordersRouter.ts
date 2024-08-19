import { Router } from 'express';
import ordersController from '../controllers/ordersController';

const ordersRouter = Router();

ordersRouter.post('/get_orders_on_assembly', ordersController.getOrdersOnAssemblyBySeller);
ordersRouter.post('/get_orders_sticker_by_id', ordersController.getOrderStickerByOrderID);

export default ordersRouter;
