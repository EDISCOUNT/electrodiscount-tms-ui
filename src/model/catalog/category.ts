import { CategoryFormData } from "@/admin/repository/catalog/category_repository";
import CategoryConfiguration from "./category_configuration";

export default class Category {

    id?: string;
    code?: string;
    name?: string;
    productsCount?: number;
    configuration?: CategoryConfiguration;
    enabled?: boolean;

    constructor({
        id,
        code,
        name,
        productsCount,
        configuration,
        enabled,
    }: {
        id?: any;
        code?: any;
        gtin?: string;
        name?: string;
        productsCount?: number;
        configuration?: any;
        enabled?: boolean;
    }) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.productsCount= productsCount; 
        this.configuration = configuration;
        this.enabled = enabled;
    }

    copyWith({
        id,
        code,
        name,
        productsCount,
        configuration,
        enabled,
    }: {
        id?: any;
        code?: any;
        name?: string;
        productsCount?: number;
        configuration?: CategoryConfiguration;
        enabled?: boolean;
    }): Category {
        return new Category({
            id: id ?? this.id,
            code: code ?? this.code,
            name: name ?? this.name,
            productsCount: productsCount?? this.productsCount,
            configuration: configuration ?? this.configuration,
            enabled: enabled ?? this.enabled,
        });
    }

    static fromJson(json: { [key: string]: any }): Category {
        return new Category({
            id: json["id"],
            code: json["code"],
            productsCount: json["productsCount"],
            name: json["name"],
            configuration: json["configuration"]? CategoryConfiguration.fromJson(json["configuration"]) : undefined,
            enabled: json["enabled"],
        });
    }

    toJson(): CategoryFormData {
        return {
            "code": this.code,
            "name": this.name,
            "configuration": this.configuration?.toJson(),
            "enabled": this.enabled,
        };
    }
}
