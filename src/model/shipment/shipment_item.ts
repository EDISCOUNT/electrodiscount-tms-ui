import Product from "../catalog/product";
import ShipmentFulfilment from "./shipment_fulfilment";


export default class ShipmentItem {
    id?: string;
    product?: Product;
    quantity: number;
    quantityReturned: any;
    internalOrderItemId: any;
    name?: string;
    fulfilment?: ShipmentFulfilment;

    constructor({
        id,
        product,
        quantity,
        quantityReturned,
        internalOrderItemId,
        name,
        fulfilment,
    }: {
        id?: string;
        product?: Product;
        quantity: number;
        quantityReturned: any;
        internalOrderItemId: any;
        name?: string;
        fulfilment?: ShipmentFulfilment;
    }) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.quantityReturned = quantityReturned;
        this.internalOrderItemId = internalOrderItemId;
        this.name = name;
        this.fulfilment = fulfilment;
    }

    copyWith({
        id,
        product,
        quantity,
        quantityReturned,
        internalOrderItemId,
        name,
        fulfilment,
    }: {
        id?: string;
        product?: Product;
        quantity?: number;
        quantityReturned?: any;
        internalOrderItemId?: any;
        name?: string;
        fulfilment?: ShipmentFulfilment;
    }): ShipmentItem {
        return new ShipmentItem({
            id: id ?? this.id,
            product: product ?? this.product,
            quantity: quantity ?? this.quantity,
            quantityReturned: quantityReturned ?? this.quantityReturned,
            internalOrderItemId: internalOrderItemId ?? this.internalOrderItemId,
            name: name ?? this.name,
            fulfilment: fulfilment ?? this.fulfilment,
        });
    }

    static fromJson(json: Record<string, any>): ShipmentItem {
        // console.log("SHIPMENT ITEM JSON: ", {json})
        return new ShipmentItem({
            id: json["id"],
            product: json["product"] != null?  Product.fromJson(json["product"]) : undefined,
            quantity: json["quantity"],
            quantityReturned: json["quantityReturned"],
            internalOrderItemId: json["internalOrderItemId"],
            name: json["name"],
            fulfilment: json["fulfilment"] != null ? ShipmentFulfilment.fromJson(json["fulfilment"]) : undefined,
        });
    }

    toJson(): ShipmentItemFormData {
        // console.log("SHIPMENT ITEM: ", {this: this});
        return {
            "product": this.product?.id,
            "quantity": this.quantity,
            // "quantityReturned": this.quantityReturned,
            // "internalOrderItemId": this.internalOrderItemId,
            "name": this.name,
            // "fulfilment": this.fulfilment?.toJson(),
        };
    }
}








export interface ShipmentItemFormData {
    product?: string;
    name?: string;
    quantity: number;
    metadata?: { [i: string]: any };
}
