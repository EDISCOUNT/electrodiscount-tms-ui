import Product from "../catalog/product";
import ShipmentFulfilment from "../shipment/shipment_fulfilment";

export default class OrderItem {
    
    id: any;
    channelProductId: any;
    channelVariantId: any;
    product: Product;
    quantity: number;
    quantityShipped: number;
    quantityCancelled: number;
    unitPrice: string;
    sku: any;
    _total?: number;
    fulfilment?: ShipmentFulfilment;


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
        total,
        fulfilment,
    }: {
        id: any;
        channelProductId: any;
        channelVariantId: any;
        product: Product;
        quantity: number;
        quantityShipped: number;
        quantityCancelled: number;
        unitPrice: string;
        sku: any;
        total?: number;
        fulfilment?: ShipmentFulfilment;
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
        this._total = total;
        this.fulfilment = fulfilment;

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
        total,
        fulfilment,
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
        total?: any;
        fulfilment?: ShipmentFulfilment;
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
            total: total ?? this.total,
            fulfilment: fulfilment ?? this.fulfilment,
        });
    }

    static fromJson(json: { [key: string]: any }): OrderItem {
        return new OrderItem({
            id: json["id"],
            channelProductId: json["channelProductId"],
            channelVariantId: json["channelVariantId"],
            product: Product.fromJson(json["product"]),
            quantity: json["quantity"],
            quantityShipped: json["quantityShipped"],
            quantityCancelled: json["quantityCancelled"],
            unitPrice: json["unitPrice"],
            sku: json["sku"],
            total: json["total"],
            fulfilment: json["fulfilment"] != null ? ShipmentFulfilment.fromJson(json["fulfilment"]) : undefined,
        });
    }

    toJson(): { [key: string]: any } {
        return {
            "id": this.id,
            "channelProductId": this.channelProductId,
            "channelVariantId": this.channelVariantId,
            "product": this.product.toJson(),
            "quantity": this.quantity,
            "quantityShipped": this.quantityShipped,
            "quantityCancelled": this.quantityCancelled,
            "unitPrice": this.unitPrice,
            "sku": this.sku,
            "total": this.total,
            "fulfilment": this.fulfilment?.toJson(),
        };
    }
}