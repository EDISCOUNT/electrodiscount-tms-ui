import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import ShipmentEvent from "@/model/shipment/shipment_event";
import Shipment from "@/model/shipment/shipment";

export async function getPaginatedShipmentEvents({ shipment, page, limit, }: { shipment: Shipment, page?: number, limit?: number }) {
    const { data } = await http.get(`/api/admin/shipment/shipments/${shipment.id!}/events?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<ShipmentEvent>({
        ...data,
        buildItem: (input) => ShipmentEvent.fromJson(input),
    })
    return pagination;
}


export async function getShipmentEventById(id: string, shipment: Shipment) {
    const { data } = await http.get(`/api/admin/shipment/shipments/${shipment.id!}/events/${id}`);
    return data;
}
