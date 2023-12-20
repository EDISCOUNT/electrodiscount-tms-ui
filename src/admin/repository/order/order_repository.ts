import http from "@/admin/plugins/http";
import Channel from "@/model/channel/channel";
import Order from "@/model/order/order";
import { encodeURLParams } from "@/utils/url";

export async function getPaginatedOrders({ page, limit, channel }: { page?: number, limit?: number, channel?: Channel | string } = {}) {
    if (channel) {
        if (typeof (channel) !== 'string') {
            channel = channel.id;
        }
    }
    const params = encodeURLParams({ page, limit, /*channel*/ })
    // console.log('PARAMS: ', params);
    if (channel) {
        const { data } = await http.get(`/api/admin/channel/channels/${channel}/orders?${params}`);
        const pagination = normalizePagination(data);
        // console.log("pagination: ", pagination);
        return pagination;
    }
    else {
        const { data } = await http.get(`/api/admin/order/orders?${params}`);
        const pagination = normalizePagination(data);
        // console.log("pagination: ", pagination);
        return pagination;
    }


    function normalizePagination(pagination: any) {
        return {
            ...pagination,
            items: pagination.items.map((data: any) => Order.fromJson(data))
        }
    }
}

export async function getOrderTypes() {
    const { data } = await http.get(`/api/admin/order/order-types`);
    return data;
}

export async function getOrder(id: string, channelId: string) {
    const { data } = await http.get(`/api/admin/order/orders/${id}`);
    return data;
}


export async function importShipment(order: Order) {
    const id = order.channelOrderId;
    const channelId = order.channel?.id;
    const { data } = await http.post(
        `/api/admin/channel/channels/${channelId}/orders/${id}/import-shipment`,
    );
    return data;
}

// export async function createOrder(data: OrderFormData) {
//     const { data: result } = await http.post(`/api/admin/order/orders`, data);
//     return result;
// }


// export async function updateOrder(id: string, data: OrderFormData) {
//     const { data: result } = await http.patch(`/api/admin/order/orders/${id}`, data);
//     return result;
// }





export interface OrderType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface OrderFormData {
    code: string;
    name: string;
    shortDescription: string;
    description: string;
    type: string;
    enabled: boolean;
    metadata: { [i: string]: any };
}
