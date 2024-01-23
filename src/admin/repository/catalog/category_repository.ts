import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Category from "@/model/catalog/category";
import { encodeURLParams } from "@/utils/url";
import { CategoryConfigurationFormData } from "@/model/catalog/category_configuration";

export async function getPaginatedCategories({ page, limit, search }: { page?: number, limit?: number, search?: string } = {}) {
    const params = encodeURLParams({ page, limit, search });
    const { data } = await http.get(`/api/admin/catalog/categories?${params}`);
    const pagination = Pagination.fromJson<Category>({
        ...data,
        buildItem: (input) => Category.fromJson(input),
    })
    return pagination;
}

export async function getCategory(id: string) {
    const { data } = await http.get(`/api/admin/catalog/categories/${id}`);
    return Category.fromJson(data);
}


export async function createCategory(data: CategoryFormData) {
    const { data: result } = await http.post(`/api/admin/catalog/categories`, data);
    return Category.fromJson(result);
}


export async function updateCategory(id: string, data: CategoryFormData) {
    const { data: result } = await http.patch(`/api/admin/catalog/categories/${id}`, data);
    return Category.fromJson(result);
}


export async function deleteCategory(id: string) {
    const { data } = await http.delete(`/api/admin/catalog/categories/${id}`);
}





export interface CategoryType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface CategoryFormData {
    code?: string;
    name?: string;
    // shortDescription: string;
    description?: string;
    configuration?: CategoryConfigurationFormData;
    // type: string;
    enabled?: boolean;
    // metadata: { [i: string]: any };
}
