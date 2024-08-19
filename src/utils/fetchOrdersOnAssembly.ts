import("node-fetch")
import { OrderInfoResponse } from '../types';
import settings from '../settings'
interface OrderStatusResponse {
    orders: {
        id: number;
        supplierStatus: 'new' | 'confirm' | 'complete' | 'cancel';
        wbStatus: 'waiting' | 'sorted' | 'sold' | 'canceled' | 'canceled_by_client' | 'declined_by_client' | 'defect' | 'ready_for_pickup';
    }[];
}

export async function getOrdersStatuses(orderIds: number[], apiKey: string): Promise<OrderStatusResponse> {
    const url = new URL(`${settings.marketplaceApi}/v3/orders/status`);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey
        },
        body: JSON.stringify({
            orders: orderIds
        })
    });

    if (!response.ok) {
        throw new Error(`Error fetching order statuses: ${response.statusText}`);
    }

    const data: any = await response.json();
   
    if (!isOrderStatusResponse(data)) {
        throw new Error('Неверный формат ответа от API "orders/status"');
    }

    return data as OrderStatusResponse;
}


export async function getOrdersOnAssembly(orderIds: number[], apiKey: string): Promise<number[]> {
    const data: OrderStatusResponse = await getOrdersStatuses(orderIds, apiKey);
    
    const ordersOnAssembly = data.orders
        .filter(order => order.supplierStatus === 'confirm')
        .map(order => order.id);

    return ordersOnAssembly;
}

function isOrderStatusResponse(data: any): data is OrderStatusResponse {
    return (
        data &&
        typeof data === 'object' &&
        Array.isArray(data.orders) &&
        data.orders.every((order: any) => 
            typeof order.id === 'number' &&
            ['new', 'confirm', 'complete', 'cancel'].includes(order.supplierStatus) &&
            ['waiting', 'sorted', 'sold', 'canceled', 'canceled_by_client', 'declined_by_client', 'defect', 'ready_for_pickup'].includes(order.wbStatus)
        )
    );
}


export async function getOrdersInfo(apiKey: string, limit: number = 1000, next: number = 0, dateFrom?: number, dateTo?: number): Promise<OrderInfoResponse> {
    const url = new URL(`${settings.marketplaceApi}/v3/orders`);

    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('next', next.toString());

    if (dateFrom) {
        url.searchParams.append('dateFrom', dateFrom.toString());
    }
    if (dateTo) {
        url.searchParams.append('dateTo', dateTo.toString());
    }
    
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching order info: ${response.statusText}`);
    }

    const data: unknown = await response.json();
    if (!isOrderInfoResponse(data)) {
        throw new Error('Неверный формат ответа от API "/orders"');
    }
    
    return data;
}


function isOrderInfoResponse(data: any): data is OrderInfoResponse {  
    return (
        typeof data === 'object' &&
        data !== null &&
        Array.isArray(data.orders)
    );
}