import http from "@/admin/plugins/http";

export async function getPaginatedAdditionalServices({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/order/additional_services?page=${page ?? 1}&limit=${limit ?? 10}`);
    console.log("DATA: ", data);
    return data;
}

export async function getAdditionalServiceTypes() {
    const { data } = await http.get(`/api/admin/order/additional_service-types`);
    return data;
}

export async function getAdditionalService(id: string) {
    const { data } = await http.get(`/api/admin/order/additional_services/${id}`);
    return data;
}


export async function createAdditionalService(data: AdditionalServiceFormData) {
    const { data: result } = await http.post(`/api/admin/order/additional_services`, data);
    return result;
}


export async function updateAdditionalService(id: string, data: AdditionalServiceFormData) {
    const { data: result } = await http.patch(`/api/admin/order/additional_services/${id}`, data);
    return result;
}





export interface AdditionalServiceType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface AdditionalServiceFormData {
    code: string;
    name: string;
    // shortDescription: string;
    description: string;
    // type: string;
    enabled: boolean;
    // metadata: { [i: string]: any };
}
