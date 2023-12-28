import Address, { AddressFormData } from "../addressing/address";
import Carrier from "../carrier/carrier";
import Channel from "../channel/channel";
import AdditionalService from "../order/additional_service";
import ShipmentDimension, { ShipmentDimensionFormData } from "./shipment_dimension";
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
  _fulfilment?: ShipmentFulfilment;
  additionalServices?: AdditionalService[];
  dimension?: ShipmentDimension;


  bookedAt?: Date | undefined;
  codAmount?: number;
  codCurrency?: string;
  type?: string;
  //
  netWeight?: number;
  volumetricWeight?: number;


  get fulfilment (): ShipmentFulfilment | undefined{

  if(this._fulfilment){
    return this._fulfilment;
  }
  else{
    return this.items.map( item => item.fulfilment).find( fulfilment => fulfilment != undefined);
  }
}

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
    dimension,
    //
    bookedAt,
    codAmount,
    codCurrency,
    type,
    netWeight,
    volumetricWeight,
    //
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
    dimension?: ShipmentDimension;
    //
    bookedAt?: Date,
    codAmount?: number,
    codCurrency?: string,
    type?: string,
    netWeight?: number,
    volumetricWeight?: number,
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
    this._fulfilment = fulfilment;
    this.additionalServices = additionalServices;
    this.dimension = dimension;
    //
    this.bookedAt = bookedAt;
    this.codAmount = codAmount;
    this.codCurrency = codCurrency;
    this.type = type;
    this.netWeight = netWeight;
    this.volumetricWeight = volumetricWeight;
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
    dimension,
    //
    bookedAt,
    codAmount,
    codCurrency,
    type,
    netWeight,
    volumetricWeight,
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
    dimension?: ShipmentDimension,
    //
    bookedAt?: Date,
    codAmount?: number,
    codCurrency?: string,
    type?: string,
    netWeight?: number,
    volumetricWeight?: number,
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
      dimension: dimension ?? this.dimension,
      //
      bookedAt: bookedAt ?? this.bookedAt,
      codAmount: codAmount ?? this.codAmount,
      codCurrency: codCurrency ?? this.codCurrency,
      type: type ?? this.type,
      netWeight: netWeight ?? this.netWeight,
      volumetricWeight: volumetricWeight ?? this.volumetricWeight,
    });
  }

  static fromJson(json: Record<string, any>): Shipment {
    return new Shipment({
      id: json["id"],
      code: json["code"],
      originAddress: json["originAddress"] != null ? Address.fromJson(json["originAddress"]) : undefined,
      destinationAddress: json["destinationAddress"] != null ? Address.fromJson(json["destinationAddress"]) : undefined,
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
      dimension: json["dimension"] ? ShipmentDimension.fromJson(json["dimension"]) : undefined,
      //
      bookedAt: json["bookedAt"] != null ? new Date(json["bookedAt"]) : undefined,
      codAmount: json["codAmount"],
      codCurrency: json["codCurrency"],
      type: json["type"],
      netWeight: json["netWeight"],
      volumetricWeight: json["volumetricWeight"],
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

    };
  }
}


export interface ShipmentFormData {
  code?: string;
  items: ShipmentItemFormData[];
  originAddress?: AddressFormData;
  destinationAddress?: AddressFormData;
  fulfilment?: ShipmentFulfilmentFormData;
  description?: string;
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
}

