import Address from "../addressing/address";
import Channel from "../channel/channel";
import OrderItem from "./order_item";

export default class Order {



    id?: string;
    code?: string;
    status?: string;
    currency?: string;
    _total?: number;
    customerData: { [key: string]: string | null };
    paid: boolean;
    paidAt?: Date;
    metadata: { [key: string]: any };
    channel?: Channel;
    items: OrderItem[];
    shippingAddress?: Address;
    billingAddress?: Address;
    channelOrderId?: string;
    channelOrderCreatedAt?: Date;

    get total(): number {

        if (this._total != null) {
            return this._total;
        }
        if (this.items.length == 0) {
            return 0;
        }
        return this.items.reduce((total, item) => {
            return total + item.total;
        }, 0);
    }



    get fulfilments() {
        return this.items
            .filter((item) => item.fulfilment != null)
            .map((item) => item.fulfilment!);
    }

    constructor({
        id,
        code,
        status,
        currency,
        total,
        customerData,
        paid,
        paidAt,
        metadata,
        channel,
        items,
        shippingAddress,
        billingAddress,
        channelOrderId,
        channelOrderCreatedAt,
    }: {
        id: any;
        code: any;
        status: any;
        currency: any;
        total: number;
        customerData: any;
        paid: any;
        paidAt: any;
        metadata: { [i: string]: any };
        channel?: Channel;
        items: OrderItem[];
        shippingAddress?: Address;
        billingAddress?: Address;
        channelOrderId?: string;
        channelOrderCreatedAt?: Date;
    }) {
        this.id = id;
        this.code = code;
        this.status = status;
        this.currency = currency;
        this._total = total != null ? Number(total) : undefined;
        this.customerData = customerData;
        this.paid = paid;
        this.paidAt = paidAt;
        this.metadata = metadata;
        this.channel = channel;
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.billingAddress = billingAddress;
        this.channelOrderId = channelOrderId;
        this.channelOrderCreatedAt = channelOrderCreatedAt;
    }

    copyWith({
        id,
        code,
        status,
        currency,
        total,
        customerData,
        paid,
        paidAt,
        metadata,
        channel,
        items,
        shippingAddress,
        billingAddress,
        channelOrderId,
        channelOrderCreatedAt,
    }: {
        id?: any;
        code?: any;
        status?: any;
        currency?: any;
        total?: any;
        customerData?: any;
        paid?: any;
        paidAt?: any;
        metadata?: { [i: string]: any };
        channel?: Channel;
        items?: OrderItem[];
        shippingAddress?: Address;
        billingAddress?: Address;
        channelOrderId?: string;
        channelOrderCreatedAt?: Date;
    }): Order {
        return new Order({
            id: id ?? this.id,
            code: code ?? this.code,
            status: status ?? this.status,
            currency: currency ?? this.currency,
            total: total ?? this.total,
            customerData: customerData ?? this.customerData,
            paid: paid ?? this.paid,
            paidAt: paidAt ?? this.paidAt,
            metadata: metadata ?? this.metadata,
            channel: channel ?? this.channel,
            items: items ?? this.items,
            shippingAddress: shippingAddress ?? this.shippingAddress,
            billingAddress: billingAddress ?? this.billingAddress,
            channelOrderId: channelOrderId ?? this.channelOrderId,
            channelOrderCreatedAt: channelOrderCreatedAt ?? this.channelOrderCreatedAt,
        });
    }

    static fromJson(json: { [key: string]: any }): Order {
        return new Order({
            id: json["id"],
            code: json["code"],
            status: json["status"],
            currency: json["currency"],
            total: json["total"],
            customerData: json["customerData"],
            paid: json["paid"],
            paidAt: json["paidAt"],
            metadata: json["metadata"],
            channel: json["channel"] != null ? Channel.fromJson(json["channel"]) : undefined,
            items: json["items"].map((x: any) => OrderItem.fromJson(x)),
            shippingAddress: json["shippingAddress"] != null ? Address.fromJson(json["shippingAddress"]) : undefined,
            billingAddress: json['billingAddress'] != null ? Address.fromJson(json['billingAddress']) : undefined,
            channelOrderId: json["channelOrderId"],
            channelOrderCreatedAt: json["channelOrderCreatedAt"] != null ? new Date(json["channelOrderCreatedAt"]) : undefined,
        });
    }

    toJson(): { [key: string]: any } {
        return {
            "id": this.id,
            "code": this.code,
            "status": this.status,
            "currency": this.currency,
            "total": this.total,
            "customerData": this.customerData,
            "paid": this.paid,
            "paidAt": this.paidAt,
            "metadata": this.metadata,
            "items": this.items.map((x) => x.toJson()),
            "shippingAddress": this.shippingAddress?.toJson(),
            "billingAddress": this.billingAddress?.toJson(),
            "channelOrderId": this.channelOrderId,
        };
    }

}