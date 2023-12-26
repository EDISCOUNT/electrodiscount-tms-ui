import Product from "../catalog/product";
import ShipmentFulfilment from "../shipment/shipment_fulfilment";

export default class OrderItem {

    id: any;
    channelProductId: any;
    channelVariantId: any;
    product?: Product;
    quantity: number;
    quantityShipped: number;
    quantityCancelled: number;
    unitPrice: string;
    sku: any;
    name?: string;
    _total?: number;
    fulfilment?: ShipmentFulfilment;
    status: string = "pending";


    get total(): number {
        if (this._total != null) {
            return this._total;
        }
        return parseFloat(this.unitPrice) * this.quantity;
    }

    constructor({
        id,
        channelProductId,
        channelVariantId,
        product,
        quantity,
        quantityShipped,
        quantityCancelled,
        unitPrice,
        sku,
        name,
        total,
        fulfilment,
        status,
    }: {
        id: any;
        channelProductId: any;
        channelVariantId: any;
        product?: Product;
        quantity: number;
        quantityShipped: number;
        quantityCancelled: number;
        unitPrice: string;
        sku: any;
        name?: string;
        total?: number;
        fulfilment?: ShipmentFulfilment;
        status?: string;
    }) {
        this.id = id;
        this.channelProductId = channelProductId;
        this.channelVariantId = channelVariantId;
        this.product = product;
        this.quantity = quantity;
        this.quantityShipped = quantityShipped;
        this.quantityCancelled = quantityCancelled;
        this.unitPrice = unitPrice;
        this.sku = sku;
        this.name = name;
        this._total = total;
        this.fulfilment = fulfilment;
        this.status = status ?? this.status;

    }

    copyWith({
        id,
        channelProductId,
        channelVariantId,
        product,
        quantity,
        quantityShipped,
        quantityCancelled,
        unitPrice,
        sku,
        name,
        total,
        fulfilment,
        status,
    }: {
        id?: any;
        channelProductId?: any;
        channelVariantId?: any;
        product?: Product;
        quantity?: number;
        quantityShipped?: number;
        quantityCancelled?: number;
        unitPrice?: string;
        sku?: any;
        name?: string;
        total?: any;
        fulfilment?: ShipmentFulfilment;
        status?: string;
    }): OrderItem {
        return new OrderItem({
            id: id ?? this.id,
            channelProductId: channelProductId ?? this.channelProductId,
            channelVariantId: channelVariantId ?? this.channelVariantId,
            product: product ?? this.product,
            quantity: quantity ?? this.quantity,
            quantityShipped: quantityShipped ?? this.quantityShipped,
            quantityCancelled: quantityCancelled ?? this.quantityCancelled,
            unitPrice: unitPrice ?? this.unitPrice,
            sku: sku ?? this.sku,
            name: name ?? this.name,
            total: total ?? this.total,
            fulfilment: fulfilment ?? this.fulfilment,
            status: status ?? this.status,
        });
    }

    static fromJson(json: { [key: string]: any }): OrderItem {
        return new OrderItem({
            id: json["id"],
            channelProductId: json["channelProductId"],
            channelVariantId: json["channelVariantId"],
            product: json["product"] != null ? Product.fromJson(json["product"]) : undefined,
            quantity: json["quantity"],
            quantityShipped: json["quantityShipped"],
            quantityCancelled: json["quantityCancelled"],
            unitPrice: json["unitPrice"],
            sku: json["sku"],
            name: json["name"],
            total: json["total"],
            fulfilment: json["fulfilment"] != null ? ShipmentFulfilment.fromJson(json["fulfilment"]) : undefined,
            status: json["status"],
        });
    }

    toJson(): { [key: string]: any } {
        return {
            "id": this.id,
            "channelProductId": this.channelProductId,
            "channelVariantId": this.channelVariantId,
            "product": this.product?.toJson(),
            "quantity": this.quantity,
            "quantityShipped": this.quantityShipped,
            "quantityCancelled": this.quantityCancelled,
            "unitPrice": this.unitPrice,
            "sku": this.sku,
            "name": this.name,
            "total": this.total,
            "fulfilment": this.fulfilment?.toJson(),
        };
    }
}