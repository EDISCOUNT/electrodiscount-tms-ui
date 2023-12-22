import http from "@/admin/plugins/http";
import Pagination from "@/data/pagination/pagination";
import ShipmentSource from "@/model/shipment/shipment_source";

export async function getPaginatedShipmentSources({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/shipment/sources?page=${page ?? 1}&limit=${limit ?? 10}`);
    console.log("PROVIDER PAGINATION DATA: ", data);
    const pagination = Pagination.fromJson<ShipmentSource>({
        ...data,
        buildItem: (input) => ShipmentSource.fromJson(input),
    })
    return pagination;
}


export async function getShipmentSourceById(id: string) {
    const { data } = await http.get(`/api/admin/shipment/sources/${id}`);
    return data;
}


export async function getShipmentSourceByCode(code: string) {
    const { data } = await http.get(`/api/admin/shipment/sources/query/by-code?code=${code}`);
    return data;
}