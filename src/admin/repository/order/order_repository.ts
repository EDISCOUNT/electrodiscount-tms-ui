import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Channel from "@/model/channel/channel";
import Shipment from "@/model/shipment/shipment";
import Order from "@/model/order/order";
import { encodeURLParams } from "@/utils/url";
import Carrier from "@/model/carrier/carrier";

export async function getPaginatedOrders({ page, limit, channel, criteria }: { page?: number, limit?: number, channel?: Channel | string, criteria?: { [i: string]: any } } = {}) {
    if (channel) {
        if (typeof (channel) !== 'string') {
            channel = channel.id;
        }
    }

    criteria ??= {};
    criteria = { ...criteria };
    console.log("criteria: ", { criteria })
    if ('status' in criteria) {
        if (criteria['status'] == 0) {
            delete criteria['status'];
        }
    }
    const params = encodeURLParams({
        ...criteria,
        page,
        limit
    });

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


    function normalizePagination(data: any) {
        const pagination = Pagination.fromJson<Order>({
            ...data,
            buildItem: (input) => Order.fromJson(input),
        })
        return pagination;
    }
}



export async function getOrder(orderId: string, channelId: string) {
    const { data } = await http.get(`/api/admin/channel/channels/${channelId}/orders/${orderId}`);
    return Order.fromJson(data);
}


export async function importShipment(order: Order, { carrier }: { carrier?: Carrier } = {}) {
    const id = order.channelOrderId;
    const channelId = order.channel?.id;
    const input: Record<string, any> = {};
    if (carrier) {
        input.carrier = carrier.id;
    }
    const { data } = await http.post(
        `/api/admin/channel/channels/${channelId}/import-order/${id}`, input
    );
    const shipment = Shipment.fromJson(data);
    return shipment;
}


export async function bulkImportShipment(orders: (Order[]) | (string[]), { channel, carrier }: { channel: Channel, carrier?: Carrier }) {
    const ids = orders.map(order => (order instanceof Order) ? order.channelOrderId : order);
    const channelId = channel?.id;
    const input: Record<string, any> = {
        orders: ids,
        // channel: channelId,
    };
    if (carrier) {
        input.carrier = carrier.id;
    }
    const { data } = await http.post(
        `/api/admin/channel/channels/${channelId}/bulk-import-order`, input
    );
    console.log("ORDER IMPORT RESULT: ", data);
    // const shipment = Shipment.fromJson(data);
    // return shipment;
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
