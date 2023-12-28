import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Shipment, { ShipmentFormData } from '@/model/shipment/shipment';
import { encodeURLParams } from "@/utils/url";

export async function getPaginatedShipments({ page, limit, criteria }: { page?: number, limit?: number, criteria?: { [i: string]: any } } = {}) {
    criteria ??= {};
    criteria = { ...criteria };
    console.log("criteria: ", { criteria })
    if ('status' in criteria) {
        if (criteria['status'] == 0) {
            delete criteria['status'];
        }
    }
    const query = encodeURLParams({
        ...criteria,
        page,
        limit
    });
    const { data } = await http.get(`/api/admin/shipment/shipments?${query}`);
    const pagination = Pagination.fromJson<Shipment>({
        ...data,
        buildItem: (input) => Shipment.fromJson(input),
    })
    return pagination;
}



export async function getShipment(id: string) {
    const { data } = await http.get(`/api/admin/shipment/shipments/${id}`);
    return Shipment.fromJson(data);
}




export async function generatePacklist({ shipments }: { shipments: string[] }) {
    const { data } = await http.post(`/api/admin/shipment/shipments/operation/generate-packlist`, { shipments });
    return data as { url: string };
}


export async function applyTransition({ shipment, transition }: { shipment: Shipment, transition: string }) {
    const { id } = shipment;
    const { data } = await http.post(`/api/admin/shipment/shipments/${id}/apply-transition`, { transition });
    return Shipment.fromJson(data);
}



export async function createShipment(data: ShipmentFormData) {
    const { data: result } = await http.post(`/api/admin/shipment/shipments`, data);
    return Shipment.fromJson(result);
}


export async function updateShipment(id: string, data: ShipmentFormData) {
    const { data: result } = await http.patch(`/api/admin/shipment/shipments/${id}`, data);
    return Shipment.fromJson(result);
}





export interface ShipmentType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}
