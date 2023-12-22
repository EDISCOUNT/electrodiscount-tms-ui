import Product from "../catalog/product";
import ShipmentFulfilment from "./shipment_fulfilment";


export default class ShipmentItem {
    id?: string;
    product: Product;
    quantity: number;
    quantityReturned: any;
    internalOrderItemId: any;
    fulfilment?: ShipmentFulfilment;

    constructor({
        id,
        product,
        quantity,
        quantityReturned,
        internalOrderItemId,
        fulfilment,
    }: {
        id?: string;
        product: Product;
        quantity: number;
        quantityReturned: any;
        internalOrderItemId: any;
        fulfilment?: ShipmentFulfilment;
    }) {
        this.product = product;
        this.quantity = quantity;
        this.quantityReturned = quantityReturned;
        this.internalOrderItemId = internalOrderItemId;
        this.fulfilment = fulfilment;
    }

    copyWith({
        id,
        product,
        quantity,
        quantityReturned,
        internalOrderItemId,
        fulfilment,
    }: {
        id?: string;
        product?: Product;
        quantity?: number;
        quantityReturned?: any;
        internalOrderItemId?: any;
        fulfilment?: ShipmentFulfilment;
    }): ShipmentItem {
        return new ShipmentItem({
            id: id ?? this.id,
            product: product ?? this.product,
            quantity: quantity ?? this.quantity,
            quantityReturned: quantityReturned ?? this.quantityReturned,
            internalOrderItemId: internalOrderItemId ?? this.internalOrderItemId,
            fulfilment: fulfilment ?? this.fulfilment,
        });
    }

    static fromJson(json: Record<string, any>): ShipmentItem {
        return new ShipmentItem({
            id: json["id"],
            product: Product.fromJson(json["product"]),
            quantity: json["quantity"],
            quantityReturned: json["quantityReturned"],
            internalOrderItemId: json["internalOrderItemId"],
            fulfilment: json["fulfilment"] != null ? ShipmentFulfilment.fromJson(json["fulfilment"]) : undefined,
        });
    }

    toJson(): Record<string, any> {
        return {
            "product": this.product.toJson(),
            "quantity": this.quantity,
            "quantityReturned": this.quantityReturned,
            "internalOrderItemId": this.internalOrderItemId,
            "fulfilment": this.fulfilment?.toJson(),
        };
    }
}





