import http from "@/admin/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Shipment from '@/model/shipment/shipment';

export async function getPaginatedShipments({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/shipment/shipments?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<Shipment>({
        ...data,
        buildItem: (input) => Shipment.fromJson(input),
    })
    return pagination;
}