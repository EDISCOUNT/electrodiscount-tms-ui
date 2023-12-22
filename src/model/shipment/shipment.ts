import Address from "../addressing/address";
import Carrier from "../carrier/carrier";
import Channel from "../channel/channel";
import ShipmentItem from "./shipment_item";

export default class Shipment {
    id: number;
    code: string;
    originAddress: any;
    destinationAddress: Address;
    sourceId: string;
    idOnSorce: any;
    status: string;
    channelOrderId: string;
    carrier?: Carrier;
    channel?: Channel;
    items: ShipmentItem[];
  
    constructor({
      id,
      code,
      originAddress,
      destinationAddress,
      sourceId,
      idOnSorce,
      status,
      channelOrderId,
      carrier,
      channel,
      items,
    }: {
      id: number;
      code: string;
      originAddress: any;
      destinationAddress: Address;
      sourceId: string;
      idOnSorce: any;
      status: string;
      channelOrderId: string;
      items: ShipmentItem[];
      carrier?: Carrier;
      channel?: Channel;
    }) {
      this.id = id;
      this.code = code;
      this.originAddress = originAddress;
      this.destinationAddress = destinationAddress;
      this.sourceId = sourceId;
      this.idOnSorce = idOnSorce;
      this.status = status;
      this.channelOrderId = channelOrderId;
      this.items = items;
      this.carrier = carrier;
      this.channel = channel;
    }
  
    copyWith({
      id,
      code,
      originAddress,
      destinationAddress,
      sourceId,
      idOnSorce,
      status,
      channelOrderId,
      carrier,
      channel,
      items,
    }: {
      id?: number;
      code?: string;
      originAddress?: any;
      destinationAddress?: Address;
      sourceId?: string;
      idOnSorce?: any;
      status?: string;
      channelOrderId?: string;
      carrier?: Carrier;
      channel?: Channel;
      items?: ShipmentItem[];
    }): Shipment {
      return new Shipment({
        id: id ?? this.id,
        code: code ?? this.code,
        originAddress: originAddress ?? this.originAddress,
        destinationAddress: destinationAddress ?? this.destinationAddress,
        sourceId: sourceId ?? this.sourceId,
        idOnSorce: idOnSorce ?? this.idOnSorce,
        status: status ?? this.status,
        channelOrderId: channelOrderId ?? this.channelOrderId,
        carrier: carrier ?? this.carrier,
        channel: channel ?? this.channel,
        items: items ?? this.items,
      });
    }
  
    static fromJson(json: Record<string, any>): Shipment {
      return new Shipment({
        id: json["id"],
        code: json["code"],
        originAddress: json["originAddress"],
        destinationAddress: Address.fromJson(json["destinationAddress"]),
        sourceId: json["sourceId"],
        idOnSorce: json["idOnSorce"],
        status: json["status"],
        channelOrderId: json["channelOrderId"],
        carrier: json["carrier"] ? Carrier.fromJson(json["carrier"]) : undefined,
        channel: json["channel"] ? Channel.fromJson(json["channel"]) : undefined,
        items: json["items"].map((x: any) => ShipmentItem.fromJson(x)),
      });
    }
  
    toJson(): Record<string, any> {
      return {
        "id": this.id,
        "code": this.code,
        "originAddress": this.originAddress,
        "destinationAddress": this.destinationAddress.toJson(),
        "sourceId": this.sourceId,
        "idOnSorce": this.idOnSorce,
        "status": this.status,
        "channelOrderId": this.channelOrderId,
        "items": this.items.map((x) => x.toJson()),
      };
    }
  }
  