import http from "@/admin/plugins/http";

export async function getPaginatedShipmentSources({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/shipment/sources?page=${page ?? 1}&limit=${limit ?? 10}`);
    // console.log("DATA: ", data);
    return data;
}


export async function getShipmentSourceById(id: string) {
    const { data } = await http.get(`/api/admin/shipment/sources/${id}`);
    return data;
}


export async function getShipmentSourceByCode(code: string) {
    const { data } = await http.get(`/api/admin/shipment/sources/query/by-code?code=${code}`);
    return data;
}