import http from "@/admin/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Carrier from "@/model/carrier/carrier";

export async function getPaginatedCarriers({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/carrier/carriers?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<Carrier>({
        ...data,
        buildItem: (input) => Carrier.fromJson(input),
    })
    return pagination;
}

export async function getCarrier(id: string) {
    const { data } = await http.get(`/api/admin/carrier/carriers/${id}`);
    return data;
}


export async function createCarrier(data: CarrierFormData) {
    const { data: result } = await http.post(`/api/admin/carrier/carriers`, data);
    return result;
}


export async function updateCarrier(id: string, data: CarrierFormData) {
    const { data: result } = await http.patch(`/api/admin/carrier/carriers/${id}`, data);
    return result;
}





export interface CarrierType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface CarrierFormData {
    code: string;
    name: string;
    // shortDescription: string;
    description?: string;
    // type: string;
    enabled: boolean;
    // metadata: { [i: string]: any };
}
