import Money, { MoneyFormData } from "../currency/money";

export default class CategoryConfiguration {

    id?: string;
    defaultUnitShippingPrice?: Money;

    constructor({
        id,
        defaultUnitShippingPrice,
    }: {
        id?: string;
        defaultUnitShippingPrice?: Money;
    }) {
        this.id = id;
        this.defaultUnitShippingPrice = defaultUnitShippingPrice;
    }

    copyWith({
        id,
        defaultUnitShippingPrice,
    }: {
        id?: string;
        defaultUnitShippingPrice?: Money;
    }): CategoryConfiguration {
        return new CategoryConfiguration({
            id: id ?? this.id,
            defaultUnitShippingPrice: defaultUnitShippingPrice ?? this.defaultUnitShippingPrice,
        });
    }

    static fromJson(json: { [key: string]: any }): CategoryConfiguration {
        return new CategoryConfiguration({
            id: json["id"],
            defaultUnitShippingPrice: json["defaultUnitShippingPrice"] ? Money.fromJson(json["defaultUnitShippingPrice"]) : undefined,
        });
    }

    toJson(): CategoryConfigurationFormData {
        return {
            "defaultUnitShippingPrice": this.defaultUnitShippingPrice?.toJson(),
        };
    }
}




export interface CategoryConfigurationFormData {
    defaultUnitShippingPrice?: MoneyFormData;
}