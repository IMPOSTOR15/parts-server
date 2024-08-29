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
const WSDL_URL = `${settings.frozaApi}/orders.php?WSDL`;

export async function getSubclientOrderDetails(user_login: string, user_password: string): Promise<OrderInfoResponse[]> {
    try {
        const client = await new Promise<soap.Client>((resolve, reject) => {
            soap.createClient(WSDL_URL, (err, client) => {
                if (err) reject(err);
                resolve(client);
            });
        });

        const today = moment().format('DD.MM.YYYY');

        const params: OrderParams = {
            login: user_login,
            password: user_password,
            date_start: today,
            date_end: today,
            status: 7,
        };

        const result = await new Promise<any>((resolve, reject) => {
            client.getClientOrderDetails(params, (err: any, result: any) => {
                if (err) {
                    console.error('Ошибка от SOAP:', err);
                    return reject(err);
                }
                resolve(result);
            });
        });

        if (result?.getClientOrderDetailsResult?.ClientOrderDetails) {
            const orderDetails: OrderInfoResponse[] = result.getClientOrderDetailsResult.ClientOrderDetails;
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
