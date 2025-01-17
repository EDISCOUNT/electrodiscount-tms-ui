import Address, { AddressFormData } from "../addressing/address";
import Carrier from "../carrier/carrier";
import Channel from "../channel/channel";
import Storage from "../inventory/storage";
import AdditionalService from "../order/additional_service";
import ShipmentDimension, { ShipmentDimensionFormData } from "./shipment_dimension";
import ShipmentFulfilment, { ShipmentFulfilmentFormData } from "./shipment_fulfilment";
import ShipmentFulfilmentTimeRange, { ShipmentFulfilmentTimeRangeFormData } from "./shipment_fulfilment_time_range";
import ShipmentFulfilmentType from "./shipment_fulfilment_type";
import ShipmentItem, { ShipmentItemFormData } from "./shipment_item";

export default class Shipment {
  id: number;
  code: string;
  originAddress?: Address;
  destinationAddress?: Address;
  billingAddress?: Address;
  sourceId: string;
  idOnSorce: any;
  status: string;
  channelOrderId: string;
  carrier?: Carrier;
  channel?: Channel;
  storage?: Storage;
  metadata?: Record<string, any>;
  items: ShipmentItem[];
  _fulfilment?: ShipmentFulfilment;
  additionalServices?: AdditionalService[];
  dimension?: ShipmentDimension;


  bookedAt?: Date | undefined;
  deliveredAt?: Date | undefined;
  codAmount?: number;
  codCurrency?: string;
  type?: string;
  //
  netWeight?: number;
  volumetricWeight?: number;
  //
  fulfilmentType?: ShipmentFulfilmentType;
  fulfilmentTimeRange?: ShipmentFulfilmentTimeRange;
  createdAt?: Date;



  get isDelivered(): boolean {
    return this.status === 'delivered';
  }

  get fulfilment(): ShipmentFulfilment | undefined {

    if (this._fulfilment) {
      return this._fulfilment;
    }
    else {
      return this.items.map(item => item.fulfilment).find(fulfilment => fulfilment != undefined);
    }
  }

  get fulfilments() {
    const fulfilments = this.items
      .filter((item) => item.fulfilment != null)
      .map((item) => item.fulfilment!);

    if (this._fulfilment) {
      fulfilments.unshift(this._fulfilment);
    }
    return fulfilments;
  }

  constructor({
    id,
    code,
    originAddress,
    destinationAddress,
    billingAddress,
    sourceId,
    idOnSorce,
    status,
    channelOrderId,
    carrier,
    channel,
    storage,
    metadata,
    items,
    fulfilment,
    additionalServices,
    dimension,
    //
    bookedAt,
    deliveredAt,
    codAmount,
    codCurrency,
    type,
    netWeight,
    volumetricWeight,
    //
    fulfilmentType,
    fulfilmentTimeRange,
    //
    createdAt,
  }: {
    id: number;
    code: string;
    originAddress?: Address;
    destinationAddress?: Address;
    billingAddress?: Address;
    sourceId: string;
    idOnSorce: any;
    status: string;
    channelOrderId: string;
    items: ShipmentItem[];
    carrier?: Carrier;
    channel?: Channel;
    storage?: Storage;
    metadata?: Record<string, any>;
    fulfilment?: ShipmentFulfilment;
    additionalServices?: AdditionalService[];
    dimension?: ShipmentDimension;
    //
    bookedAt?: Date,
    deliveredAt?: Date,
    codAmount?: number,
    codCurrency?: string,
    type?: string,
    netWeight?: number,
    volumetricWeight?: number,
    fulfilmentType?: ShipmentFulfilmentType,
    // 
    fulfilmentTimeRange?: ShipmentFulfilmentTimeRange,
    createdAt?: Date;
  }) {
    this.id = id;
    this.code = code;
    this.originAddress = originAddress;
    this.destinationAddress = destinationAddress;
    this.billingAddress = billingAddress;
    this.sourceId = sourceId;
    this.idOnSorce = idOnSorce;
    this.status = status;
    this.channelOrderId = channelOrderId;
    this.items = items;
    this.carrier = carrier;
    this.channel = channel;
    this.storage = storage;
    this.metadata = metadata;
    this._fulfilment = fulfilment;
    this.additionalServices = additionalServices;
    this.dimension = dimension;
    //
    this.bookedAt = bookedAt;
    this.deliveredAt = deliveredAt;
    this.codAmount = codAmount;
    this.codCurrency = codCurrency;
    this.type = type;
    this.netWeight = netWeight;
    this.volumetricWeight = volumetricWeight;
    //
    this.fulfilmentType = fulfilmentType;
    this.fulfilmentTimeRange = fulfilmentTimeRange;
    // 
    this.createdAt = createdAt;
  }

  copyWith({
    id,
    code,
    originAddress,
    destinationAddress,
    billingAddress,
    sourceId,
    idOnSorce,
    status,
    channelOrderId,
    carrier,
    channel,
    storage,
    items,
    metadata,
    fulfilment,
    additionalServices,
    dimension,
    //
    bookedAt,
    deliveredAt,
    codAmount,
    codCurrency,
    type,
    netWeight,
    volumetricWeight,
    //
    fulfilmentType,
    fulfilmentTimeRange,
    // 
    createdAt,
  }: {
    id?: number;
    code?: string;
    originAddress?: any;
    destinationAddress?: Address;
    billingAddress?: Address;
    sourceId?: string;
    idOnSorce?: any;
    status?: string;
    channelOrderId?: string;
    carrier?: Carrier;
    channel?: Channel;
    storage?: Storage;
    items?: ShipmentItem[];
    metadata?: Record<string, any>;
    fulfilment?: ShipmentFulfilment;
    additionalServices?: AdditionalService[];
    dimension?: ShipmentDimension,
    //
    bookedAt?: Date,
    deliveredAt?: Date,
    codAmount?: number,
    codCurrency?: string,
    type?: string,
    netWeight?: number,
    volumetricWeight?: number,
    //

    fulfilmentType?: ShipmentFulfilmentType,
    fulfilmentTimeRange?: ShipmentFulfilmentTimeRange,
    // 
    createdAt?: Date;
  }): Shipment {
    return new Shipment({
      id: id ?? this.id,
      code: code ?? this.code,
      originAddress: originAddress ?? this.originAddress,
      destinationAddress: destinationAddress ?? this.destinationAddress,
      billingAddress: billingAddress ?? this.billingAddress,
      sourceId: sourceId ?? this.sourceId,
      idOnSorce: idOnSorce ?? this.idOnSorce,
      status: status ?? this.status,
      channelOrderId: channelOrderId ?? this.channelOrderId,
      carrier: carrier ?? this.carrier,
      channel: channel ?? this.channel,
      storage: storage ?? this.storage,
      items: items ?? this.items,
      metadata: metadata ?? this.metadata,
      fulfilment: fulfilment ?? this.fulfilment,
      additionalServices: additionalServices ?? this.additionalServices,
      dimension: dimension ?? this.dimension,
      //
      bookedAt: bookedAt ?? this.bookedAt,
      deliveredAt: deliveredAt ?? this.deliveredAt,
      codAmount: codAmount ?? this.codAmount,
      codCurrency: codCurrency ?? this.codCurrency,
      type: type ?? this.type,
      netWeight: netWeight ?? this.netWeight,
      volumetricWeight: volumetricWeight ?? this.volumetricWeight,
      //
      fulfilmentType: fulfilmentType ?? this.fulfilmentType,
      fulfilmentTimeRange: fulfilmentTimeRange ?? this.fulfilmentTimeRange,
      // 
      createdAt: createdAt ?? this.createdAt,
    });
  }

  static fromJson(json: Record<string, any>): Shipment {
    return new Shipment({
      id: json["id"],
      code: json["code"],
      originAddress: json["originAddress"] != null ? Address.fromJson(json["originAddress"]) : undefined,
      destinationAddress: json["destinationAddress"] != null ? Address.fromJson(json["destinationAddress"]) : undefined,
      billingAddress: json["billingAddress"] != null ? Address.fromJson(json["billingAddress"]) : undefined,
      sourceId: json["sourceId"],
      idOnSorce: json["idOnSorce"],
      status: json["status"],
      channelOrderId: json["channelOrderId"],
      carrier: json["carrier"] ? Carrier.fromJson(json["carrier"]) : undefined,
      channel: json["channel"] ? Channel.fromJson(json["channel"]) : undefined,
      storage: json["storage"] ? Storage.fromJson(json["storage"]) : undefined,
      items: json["items"].map((x: any) => ShipmentItem.fromJson(x)),
      additionalServices: json["additionalServices"]?.map((x: any) => AdditionalService.fromJson(x)),
      metadata: json["metadata"] ?? [],
      fulfilment: json["fulfilment"] ? ShipmentFulfilment.fromJson(json["fulfilment"]) : undefined,
      dimension: json["dimension"] ? ShipmentDimension.fromJson(json["dimension"]) : undefined,
      //
      bookedAt: json["bookedAt"] != null ? new Date(json["bookedAt"]) : undefined,
      deliveredAt: json["deliveredAt"] != null ? new Date(json["deliveredAt"]) : undefined,
      codAmount: json["codAmount"],
      codCurrency: json["codCurrency"],
      type: json["type"],
      netWeight: json["netWeight"],
      volumetricWeight: json["volumetricWeight"],
      //
      fulfilmentType: json['fulfilmentType'],
      fulfilmentTimeRange: json['fulfilmentTimeRange'] ? ShipmentFulfilmentTimeRange.fromJson(json['fulfilmentTimeRange']) : undefined,
      // 
      createdAt: json["createdAt"] != null ? new Date(json["createdAt"]) : undefined,
    });
  }

  toJson(): ShipmentFormData {
    return {
      "code": this.code,
      // "originAddress": this.originAddress?.id ?? this.originAddress?.toJson(),
      // "destinationAddress": this.destinationAddress?.id ?? this.destinationAddress?.toJson(),
      //
      "originAddress": this.originAddress?.toJson(),
      "destinationAddress": this.destinationAddress?.toJson(),
      //
      "channelOrderId": this.channelOrderId,
      "items": this.items.map((x) => x.toJson()),
      "additionalServices": this.additionalServices?.map((x) => x.id),
      "carrier": this.carrier?.id,
      "channel": this.channel?.id,
      "storage": this.storage?.id,
      // "metadata": this.metadata ?? {},
      "fulfilment": this._fulfilment?.toJson(),
      "dimension": this.dimension?.toJson(),
      //
      "type": this.type,
      "bookedAt": this.bookedAt,
      "volumetricWeight": this.volumetricWeight,
      "netWeight": this.netWeight,
      "codAmount": this.codAmount,
      "codCurrency": this.codCurrency,
      // 
      "fulfilmentType": this.fulfilmentType,
      "fulfilmentTimeRange": this.fulfilmentTimeRange?.toJson(),
    };
  }
}


export interface ShipmentFormData {
  code?: string;
  items?: ShipmentItemFormData[];
  originAddress?: AddressFormData;
  destinationAddress?: AddressFormData;
  fulfilment?: ShipmentFulfilmentFormData;
  deliveryNote?: string;
  additionalServices?: string[],
  metadata?: { [i: string]: any };
  bookedAt?: Date | string;
  channelOrderId?: string;
  codAmount?: number;
  codCurrency?: string;
  type?: string;
  //
  dimension?: ShipmentDimensionFormData;
  netWeight?: number;
  volumetricWeight?: number;
  //
  carrier?: string;
  channel?: string;
  storage?: string;
  // 
  fulfilmentType?: ShipmentFulfilmentType;
  fulfilmentTimeRange?: ShipmentFulfilmentTimeRangeFormData;
}

