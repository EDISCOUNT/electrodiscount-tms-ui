import http from "@/admin/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Product from "@/model/catalog/product";

export async function getPaginatedProducts({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/catalog/products?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<Product>({
        ...data,
        buildItem: (input) => Product.fromJson(input),
    })
    return pagination;
}

export async function getProduct(id: string) {
    const { data } = await http.get(`/api/admin/catalog/products/${id}`);
    return data;
}


export async function createProduct(data: ProductFormData) {
    const { data: result } = await http.post(`/api/admin/catalog/products`, data);
    return result;
}


export async function updateProduct(id: string, data: ProductFormData) {
    const { data: result } = await http.patch(`/api/admin/catalog/products/${id}`, data);
    return result;
}





export interface ProductType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface ProductFormData {
    code: string;
    gtin?: string;
    name: string;
    // shortDescription: string;
    description?: string;
    // type: string;
    enabled: boolean;
    // metadata: { [i: string]: any };
}
