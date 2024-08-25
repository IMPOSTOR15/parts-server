import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/models';
import ApiError from '../error/ApiError';
import { getSubclientOrderDetails } from '../utils/frozaFetch';


class FrozaController {
    async getOrdersGivenOut(req: Request, res: Response, next: NextFunction) {
        try {
            const { seller_code } = req.body;
            const user_froza_login = 
                seller_code === 'BFD2' ? process.env.BFD2_FROZA_LOGIN : 
                seller_code === 'CNV5' ? process.env.CNV5_FROZA_LOGIN : 
                '';

            const user_froza_password = 
                seller_code === 'BFD2' ? process.env.BFD2_FROZA_PASSWORD : 
                seller_code === 'CNV5' ? process.env.CNV5_FROZA_PASSWORD : 
                '';
            if (!user_froza_login || !user_froza_password) {
                throw new Error('Логин или пароль для пользовтаеля не найден')
            }
            const orderDetails = await getSubclientOrderDetails(user_froza_login, user_froza_password);
            res.json(orderDetails);

        } catch (error) {
            res.status(500).send(`Ошибка при получении данных о заказах: ${error}`);
        }
    }

    
}

export default new FrozaController();
