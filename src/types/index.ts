export interface OrderAddress {
    fullAddress: string;
    province: string;
    area: string;
    city: string;
    street: string;
    home: string;
    flat: string;
    entrance: string;
    longitude: number;
    latitude: number;
}

export interface Order {
    address: OrderAddress;
    scanPrice: number;
    deliveryType: string;
    supplyId: string;
    orderUid: string;
    article: string;
    colorCode: string;
    rid: string;
    createdAt: string; // Дата в формате ISO
    offices: string[];
    skus: string[];
    id: number;
    warehouseId: number;
    nmId: number;
    chrtId: number;
    price: number;
    convertedPrice: number;
    currencyCode: number;
    convertedCurrencyCode: number;
    cargoType: number;
    isZeroOrder: boolean;
}

export interface OrderInfoResponse {
    next: number;
    orders: Order[];
}
