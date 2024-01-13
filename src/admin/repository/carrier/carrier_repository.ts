import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Carrier, { CarrierLogoData } from "@/model/carrier/carrier";
import { encodeURLParams } from "@/utils/url";

export async function getPaginatedCarriers({ page, limit, search, criteria, sortBy, }: { page?: number, limit?: number, search?: string, criteria?: { [i: string]: any }, sortBy?: { [i: string]: 'asc' | 'desc' } } = {}) {
    // const params = encodeURLParams({ page, limit, search });
    criteria ??= {};
    criteria = { ...criteria };
    // console.log("criteria: ", { criteria })
    if ('status' in criteria) {
        if (criteria['status'] == 0) {
            delete criteria['status'];
        }
    }
    const params = encodeURLParams({
        ...criteria,
        page,
        limit,
        search,
    });
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
    const formData = buildFormData(data);
    const { data: result } = await http.post(`/api/admin/carrier/carriers`, formData);
    return Carrier.fromJson(result);
}


export async function updateCarrier(id: string, data: CarrierFormData) {
    // const formData = buildFormData(data);
    // formData.append('_method', 'PATCH');
    if (data.logoImage) {
        delete data.logoImage;
    }
    const { data: result } = await http.patch(`/api/admin/carrier/carriers/${id}`, data);
    return Carrier.fromJson(result);
}


export async function deleteCarrier(id: string,) {
    const { data: result } = await http.delete(`/api/admin/carrier/carriers/${id}`);
}


export async function updateCarrierLogo(id: string, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    const { data: result } = await http.post(`/api/admin/carrier/carriers/${id}/logo`, formData);
    return Carrier.fromJson(result);
}



export function buildFormData(input: CarrierFormData) {
    const formData = new FormData();
    formData.append('code', input.code);
    formData.append('name', input.name);
    formData.append('description', input.description || '');
    formData.append('enabled', input.enabled ? '1' : '0');
    formData.append('operatorUser', input.operatorUser || '');
    formData.append('emailAddress', input.emailAddress || '');
    formData.append('phoneNumber', input.phoneNumber || '');
    if (input.logoImage) {
        formData.append('logoImage', input.logoImage as File);
    }
    return formData;
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
    operatorUser?: string;
    emailAddress?: string;
    phoneNumber?: string;
    logoImage?: File | CarrierLogoData;
    // metadata: { [i: string]: any };
}
