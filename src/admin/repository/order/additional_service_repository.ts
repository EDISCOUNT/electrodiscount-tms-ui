import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import AdditionalService from "@/model/order/additional_service";

export async function getPaginatedAdditionalServices({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/order/additional_services?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<AdditionalService>({
        ...data,
        buildItem: (input) => AdditionalService.fromJson(input),
    })
    return pagination;
}

export async function getAdditionalServiceTypes() {
    const { data } = await http.get(`/api/admin/order/additional_service-types`);
    return AdditionalService.fromJson(data);
}

export async function getAdditionalService(id: string) {
    const { data } = await http.get(`/api/admin/order/additional_services/${id}`);
    return AdditionalService.fromJson(data);
}

export async function createAdditionalService(data: AdditionalServiceFormData) {
    const { data: result } = await http.post(`/api/admin/order/additional_services`, data);
    return AdditionalService.fromJson(result);
}

export async function updateAdditionalService(id: string, data: AdditionalServiceFormData) {
    const { data: result } = await http.patch(`/api/admin/order/additional_services/${id}`, data);
    return AdditionalService.fromJson(result);
}


export async function deleteAdditionalService(id: string) {
    const { data } = await http.delete(`/api/admin/order/additional_services/${id}`);
}



export interface AdditionalServiceType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface AdditionalServiceFormData {
    code: string;
    title: string;
    // shortDescription: string;
    description?: string;
    // type: string;
    enabled: boolean;
    // metadata: { [i: string]: any };
}
