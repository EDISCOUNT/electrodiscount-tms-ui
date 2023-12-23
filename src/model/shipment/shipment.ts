import Address, { AddressFormData } from "../addressing/address";
import Carrier from "../carrier/carrier";
import Channel from "../channel/channel";
import AdditionalService from "../order/additional_service";
import ShipmentFulfilment, { ShipmentFulfilmentFormData } from "./shipment_fulfilment";
import ShipmentItem, { ShipmentItemFormData } from "./shipment_item";

export default class Shipment {
  id: number;
  code: string;
  originAddress?: Address;
  destinationAddress?: Address;
  sourceId: string;
  idOnSorce: any;
  status: string;
  channelOrderId: string;
  carrier?: Carrier;
  channel?: Channel;
  metadata?: Record<string, any>;
  items: ShipmentItem[];
  fulfilment?: ShipmentFulfilment;
  additionalServices?: AdditionalService[];

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
    metadata,
    items,
    fulfilment,
    additionalServices,
  }: {
    id: number;
    code: string;
    originAddress?: Address;
    destinationAddress?: Address;
    sourceId: string;
    idOnSorce: any;
    status: string;
    channelOrderId: string;
    items: ShipmentItem[];
    carrier?: Carrier;
    channel?: Channel;
    metadata?: Record<string, any>;
    fulfilment?: ShipmentFulfilment;
    additionalServices?: AdditionalService[];
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
    this.metadata = metadata;
    this.fulfilment = fulfilment;
    this.additionalServices = additionalServices;
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
    metadata,
    fulfilment,
    additionalServices,
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
    metadata?: Record<string, any>;
    fulfilment?: ShipmentFulfilment;
    additionalServices?: AdditionalService[];
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
      metadata: metadata ?? this.metadata,
      fulfilment: fulfilment ?? this.fulfilment,
      additionalServices: additionalServices ?? this.additionalServices,
    });
  }

  static fromJson(json: Record<string, any>): Shipment {
    return new Shipment({
      id: json["id"],
      code: json["code"],
      originAddress: json["originAddress"] != null ? Address.fromJson(json["originAddress"]) : undefined,
      destinationAddress: json["originAddress"] != null ? Address.fromJson(json["originAddress"]) : undefined,
      sourceId: json["sourceId"],
      idOnSorce: json["idOnSorce"],
      status: json["status"],
      channelOrderId: json["channelOrderId"],
      carrier: json["carrier"] ? Carrier.fromJson(json["carrier"]) : undefined,
      channel: json["channel"] ? Channel.fromJson(json["channel"]) : undefined,
      items: json["items"].map((x: any) => ShipmentItem.fromJson(x)),
      additionalServices: json["additionalServices"]?.map((x: any) => AdditionalService.fromJson(x)),
      metadata: json["metadata"] ?? [],
      fulfilment: json["fulfilment"] ? ShipmentFulfilment.fromJson(json["fulfilment"]) : undefined,
    });
  }

  toJson(): ShipmentFormData {
    return {
      "code": this.code,
      "originAddress": this.originAddress?.id ?? this.originAddress?.toJson(),
      "destinationAddress": this.destinationAddress?.id ?? this.destinationAddress?.toJson(),
      // "channelOrderId": this.channelOrderId,
      "items": this.items.map((x) => x.toJson()),
      "additionalServices": this.additionalServices?.map((x) => x.id),
      // "carrier": this.carrier?.toJson(),
      // "metadata": this.metadata ?? [],
      "fulfilment": this.fulfilment?.toJson(),
    };
  }
}


export interface ShipmentFormData {
  code: string;
  items: ShipmentItemFormData[];
  originAddress?: string | AddressFormData;
  destinationAddress?: string | AddressFormData;
  fulfilment?: ShipmentFulfilmentFormData;
  description?: string;
  additionalServices?: string[],
  metadata?: { [i: string]: any };
  //
  carrier?: string;
}

