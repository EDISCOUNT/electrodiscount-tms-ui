import Product from "../catalog/product";

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
        };
    }
}