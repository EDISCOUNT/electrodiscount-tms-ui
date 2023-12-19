import http from "@/admin/plugins/http";

export async function getPaginatedShipments({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/shipment/shipments?page=${page ?? 1}&limit=${limit ?? 10}`);
    console.log("DATA: ", data);
    return data;
}