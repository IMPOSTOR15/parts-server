import settings from "../settings";

import("node-fetch")

export interface StickerResponse {
    stickers: Array<{ orderId: number; stickerData: string }>;
}

export async function getOrdersStickers(
    apiKey: string,
    orderIds: number[],
    type: 'svg' | 'zplv' | 'zplh' | 'png',
    width: 58 | 40,
    height: 40 | 30
): Promise<StickerResponse> {
    const url = new URL(`${settings.marketplaceApi}/v3/orders/stickers`);
    url.searchParams.append('type', type);
    url.searchParams.append('width', width.toString());
    url.searchParams.append('height', height.toString());

    if (orderIds.length > 100) {
        throw new Error('Нельзя запросить больше 100 этикеток за раз.');
    }

    const response = await fetch(url.toString(), {
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
        throw new Error(`${response.status} Error fetching stickers: ${response.statusText}`);
    }

    const data: StickerResponse = await response.json();
    return data;
}

