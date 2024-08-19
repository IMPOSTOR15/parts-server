import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/models';
import ApiError from '../error/ApiError';
import { getOrdersInfo, getOrdersOnAssembly, getOrdersStatuses } from '../utils/fetchOrdersOnAssembly';
import { OrderInfoResponse } from '../types'
import { getOrdersStickers, StickerResponse } from '../utils/fecthSticker';

class OrdersController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { login, password, role } = req.body;
            if (!login || !password) {
                return next(ApiError.badRequest('Не задан пароль или логин'));
            }
            const candidate = await User.findOne({ where: { login } });
            if (candidate) {
                return next(ApiError.badRequest('Пользователь уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({ login, role, password: hashPassword });
        } catch (e) {
            next(ApiError.badRequest((e as Error).message));
        }
    }

    async getOrdersOnAssemblyBySeller(req: Request, res: Response, next: NextFunction) {
        try {
            const { seller_code } = req.body;
    
            const APIKEY = 
                seller_code === 'BFD2' ? process.env.BFD2_WB_CONTENT_APIKEY : 
                seller_code === 'CNV5' ? process.env.CNV5_WB_CONTENT_APIKEY : 
                '';

            if (!APIKEY) {
                return next(ApiError.badRequest('АПИ КЛЮЧ ВБ НЕ НАЙДЕН'));
            }
    
            const ordersInfo: OrderInfoResponse = await getOrdersInfo(APIKEY, 1000, 0);
            const orderIds = ordersInfo.orders.map(order => order.id);
            const orderStatuses = await getOrdersStatuses(orderIds, APIKEY);
            
            const ordersOnAssembly = ordersInfo.orders.filter(order => {
                const status = orderStatuses.orders.find(status => status.id === order.id);
                return status && status.supplierStatus === 'confirm';
            }).map(order => {
                const status = orderStatuses.orders.find(status => status.id === order.id);
                return {
                    ...order,
                    supplierStatus: status?.supplierStatus,
                    wbStatus: status?.wbStatus
                };
            });
            
            return res.json({ data: ordersOnAssembly });
        } catch (error) {
            next(ApiError.internal(`Ошибка при получении информации о сборочных заданиях: ${(error as Error).message}`));
        }
    }

    async getOrderStickerByOrderID(req: Request, res: Response, next: NextFunction) {
        try {
            const { order_id, seller_code } = req.body;
            if (typeof order_id !== 'number') {
                return next(ApiError.badRequest('id заказа должно быть числом'));
            }

            const APIKEY = 
                seller_code === 'BFD2' ? process.env.BFD2_WB_CONTENT_APIKEY : 
                seller_code === 'CNV5' ? process.env.CNV5_WB_CONTENT_APIKEY : 
                '';

            if (!APIKEY) {
                return next(ApiError.badRequest('АПИ КЛЮЧ ВБ НЕ НАЙДЕН'));
            }
    
            const orderStcikerData: StickerResponse = await getOrdersStickers(APIKEY, [order_id], 'png', 58, 40);

            return res.json({ data: orderStcikerData });
        } catch (error) {
            next(ApiError.internal(`Ошибка при получении стикера для задания: ${(error as Error).message}`));
        }
    }

    
}

export default new OrdersController();
