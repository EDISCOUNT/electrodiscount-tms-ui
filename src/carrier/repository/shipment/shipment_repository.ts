import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Shipment, { ShipmentFormData } from '@/model/shipment/shipment';

export async function getPaginatedShipments({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/carrier/shipment/shipments?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<Shipment>({
        ...data,
        buildItem: (input) => Shipment.fromJson(input),
    })
    return pagination;
}



export async function getShipment(id: string) {
    const { data } = await http.get(`/api/carrier/shipment/shipments/${id}`);
    return Shipment.fromJson(data);
}



export async function createShipment(data: ShipmentFormData) {
    const { data: result } = await http.post(`/api/carrier/shipment/shipments`, data);
    return Shipment.fromJson(result);
}


export async function updateShipment(id: string, data: ShipmentFormData) {
    const { data: result } = await http.patch(`/api/carrier/shipment/shipments/${id}`, data);
    return Shipment.fromJson(result);
}





export interface ShipmentType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}
