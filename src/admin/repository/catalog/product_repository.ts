import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Product from "@/model/catalog/product";

export async function getPaginatedProducts({ page, limit, search}: { page?: number, limit?: number, search?: string } = {}) {
    const { data } = await http.get(`/api/admin/catalog/products?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<Product>({
        ...data,
        buildItem: (input) => Product.fromJson(input),
    })
    return pagination;
}

export async function getProduct(id: string) {
    const { data } = await http.get(`/api/admin/catalog/products/${id}`);
    return Product.fromJson(data);
}


export async function createProduct(data: ProductFormData) {
    const { data: result } = await http.post(`/api/admin/catalog/products`, data);
    return Product.fromJson(result);
}


export async function updateProduct(id: string, data: ProductFormData) {
    const { data: result } = await http.patch(`/api/admin/catalog/products/${id}`, data);
    return Product.fromJson(result);
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