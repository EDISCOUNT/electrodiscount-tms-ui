import { ProductFormData } from "@/admin/repository/catalog/product_repository";
import Category from "./category";

export default class Product {


    id?: string;
    code?: string;
    gtin?: string;
    name?: string;
    price: any;
    category?: Category;
    enabled?: boolean;

    constructor({
        id,
        code,
        gtin,
        name,
        price,
        category,
        enabled,
    }: {
        id?: any;
        code?: any;
        gtin?: string;
        name?: string;
        price?: any;
        category?: Category;
        enabled?: boolean;
    }) {
        this.id = id;
        this.code = code;
        this.gtin = gtin;
        this.name = name;
        this.price = price;
        this.category = category;
        this.enabled = enabled;
    }

    copyWith({
        id,
        code,
        gtin,
        name,
        price,
        category,
        enabled,
    }: {
        id?: any;
        code?: any;
        gtin?: string;
        name?: string;
        price?: any;
        category?: Category;
        enabled?: boolean;
    }): Product {
        return new Product({
            id: id ?? this.id,
            code: code ?? this.code,
            gtin: gtin ?? this.gtin,
            name: name ?? this.name,
            price: price ?? this.price,
            category: category ?? this.category,
            enabled: enabled ?? this.enabled,
        });
    }

    static fromJson(json: { [key: string]: any }): Product {
        return new Product({
            id: json["id"],
            code: json["code"],
            gtin: json["gtin"],
            name: json["name"],
            price: json["price"],
            category: json["category"] ? Category.fromJson(json["category"]) : undefined,
            enabled: json["enabled"],
        });
    }

    toJson(): ProductFormData {
        return {
            // "id": this.id,
            "code": this.code,
            "gtin": this.gtin,
            "name": this.name,
            "category": this.category?.id,
            // "price": this.price,
            // "category": this.category?.toJson(),
            "enabled": this.enabled,
        };
    }
}




 
  
//   class Product {
//     id: number;
//     code: string;
//     gtin: string;
//     name: string;
//     price: any;
  
//     constructor({
//       id,
//       code,
//       gtin,
//       name,
//       price,
//     }: {
//       id: number;
//       code: string;
//       gtin: string;
//       name: string;
//       price: any;
//     }) {
//       this.id = id;
//       this.code = code;
//       this.gtin = gtin;
//       this.name = name;
//       this.price = price;
//     }
  
//     copyWith({
//       id,
//       code,
//       gtin,
//       name,
//       price,
//     }: {
//       id?: number;
//       code?: string;
//       gtin?: string;
//       name?: string;
//       price?: any;
//     }): Product {
//       return new Product({
//         id: id ?? this.id,
//         code: code ?? this.code,
//         gtin: gtin ?? this.gtin,
//         name: name ?? this.name,
//         price: price ?? this.price,
//       });
//     }
  
//     static fromJson(json: Record<string, any>): Product {
//       return new Product({
//         id: json["id"],
//         code: json["code"],
//         gtin: json["gtin"],
//         name: json["name"],
//         price: json["price"],
//       });
//     }
  
//     toJson(): Record<string, any> {
//       return {
//         "id": this.id,
//         "code": this.code,
//         "gtin": this.gtin,
//         "name": this.name,
//         "price": this.price,
//       };
//     }
//   }
  