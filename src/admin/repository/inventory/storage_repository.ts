import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Storage from "@/model/inventory/storage";
import { AddressFormData } from "@/model/addressing/address";
import { encodeURLParams } from "@/utils/url";

export async function getPaginatedStorages({ page, limit, search}: { page?: number, limit?: number, search?: string } = {}) {
    const params = encodeURLParams({page, limit, search});
    const { data } = await http.get(`/api/admin/inventory/storages?${params}`);
    const pagination = Pagination.fromJson<Storage>({
        ...data,
        buildItem: (input) => Storage.fromJson(input),
    })
    return pagination;
}

export async function getStorage(id: string) {
    const { data } = await http.get(`/api/admin/inventory/storages/${id}`);
    return Storage.fromJson(data);
}


export async function createStorage(data: StorageFormData) {
    const { data: result } = await http.post(`/api/admin/inventory/storages`, data);
    return Storage.fromJson(result);
}


export async function updateStorage(id: string, data: StorageFormData) {
    const { data: result } = await http.patch(`/api/admin/inventory/storages/${id}`, data);
    return Storage.fromJson(result);
}





export interface StorageType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface StorageFormData {
    code: string;
    name: string;
    address?: AddressFormData;
    // shortDescription: string;
    description?: string;
    // type: string;
    enabled: boolean;
    // metadata: { [i: string]: any };
}
