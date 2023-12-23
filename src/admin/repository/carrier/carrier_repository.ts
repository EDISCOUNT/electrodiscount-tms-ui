import http from "@/admin/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Carrier from "@/model/carrier/carrier";
import { encodeURLParams } from "@/utils/url";

export async function getPaginatedCarriers({ page, limit, search }: { page?: number, limit?: number, search?: string } = {}) {
    const params = encodeURLParams({page, limit, search});
    const { data } = await http.get(`/api/admin/carrier/carriers?${params}`);
    const pagination = Pagination.fromJson<Carrier>({
        ...data,
        buildItem: (input) => Carrier.fromJson(input),
    })
    return pagination;
}

export async function getCarrier(id: string) {
    const { data } = await http.get(`/api/admin/carrier/carriers/${id}`);
    return Carrier.fromJson(data);
}


export async function createCarrier(data: CarrierFormData) {
    const { data: result } = await http.post(`/api/admin/carrier/carriers`, data);
    return Carrier.fromJson(result);
}


export async function updateCarrier(id: string, data: CarrierFormData) {
    const { data: result } = await http.patch(`/api/admin/carrier/carriers/${id}`, data);
    return Carrier.fromJson(result);
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
