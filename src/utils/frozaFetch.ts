import * as soap from 'soap';
import moment from 'moment';
import { OrderInfoResponse } from '../types';
import settings from '../settings';

interface OrderParams {
    login: string;
    password: string;
    date_start?: string;
    date_end?: string;
    status?: number;
    archive?: number;
    search?: string;
    type_search?: number;
    date_st?: number;
}

export async function getSubclientOrderDetails(user_login: string, user_password: string): Promise<OrderInfoResponse[]> {
    try {
        const client = await soap.createClientAsync(`${settings.frozaApi}/orders.php?WSDL`);
        const today = moment().format('DD.MM.YYYY');
        console.log('client', client);
        
        const params: OrderParams = {
            login: user_login,
            password: user_password,
            date_start: today,
            date_end: today,
            status: 7,
        };

        const [result] = await client.getSubclientOrderDetailsAsync(params);

        if (result.getSubclientOrderDetailsResult && result.getSubclientOrderDetailsResult.SubclientOrderDetails) {
            const orderDetails: OrderInfoResponse[] = result.getSubclientOrderDetailsResult.SubclientOrderDetails;
            return orderDetails;
        } else {
            console.warn('Заказов не найдено.');
            return [];
        }
    } catch (error) {
        console.error('Ошибка при получении данных о заказах:', error);
        throw error;
    }
}
