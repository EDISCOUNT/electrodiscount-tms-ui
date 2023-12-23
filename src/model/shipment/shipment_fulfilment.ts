export default class ShipmentFulfilment {
    id: null | string;
    method: string;
    distributionParty: string;
    latestDeliveryDate?: Date;
    exactDeliveryDate?:  Date;
    expiryDate?: Date;
    timeFrameType: string;
  
    constructor({
      id,
      method,
      distributionParty,
      latestDeliveryDate,
      exactDeliveryDate,
      expiryDate,
      timeFrameType,
    }: {
      id: null | string;
      method: string;
      distributionParty: string;
      latestDeliveryDate?: Date;
      exactDeliveryDate?: Date;
      expiryDate?: Date;
      timeFrameType: string;
    }) {
      this.id = id;
      this.method = method;
      this.distributionParty = distributionParty;
      this.latestDeliveryDate = latestDeliveryDate;
      this.exactDeliveryDate = exactDeliveryDate;
      this.expiryDate = expiryDate;
      this.timeFrameType = timeFrameType;
    }
  
    static fromJson(json: Record<string, any>): ShipmentFulfilment {
      return new ShipmentFulfilment({
        id: json["id"],
        method: json["method"],
        distributionParty: json["distributionParty"],
        latestDeliveryDate: json["latestDeliveryDate"] != null ? new Date(json["latestDeliveryDate"]) : undefined,
        exactDeliveryDate: json["exactDeliveryDate"] != null ? new Date(json["exactDeliveryDate"]) : undefined,
        expiryDate: json["expiryDate"] != null ? new Date(json["expiryDate"]) : undefined,
        timeFrameType: json["timeFrameType"],
      });
    }
  
    toJson(): ShipmentFulfilmentFormData {
      return {
        "method": this.method,
        "distributionParty": this.distributionParty,
        "latestDeliveryDate": this.latestDeliveryDate?.toISOString(),
        "exactDeliveryDate": this.exactDeliveryDate?.toISOString(),
        "expiryDate": this.expiryDate?.toISOString(),
        "timeFrameType": this.timeFrameType,
      };
    }
  }


  export interface ShipmentFulfilmentFormData{
    method?: string;
    distributionParty?: string;
    latestDeliveryDate?: string;
    exactDeliveryDate?:  string;
    expiryDate?: string;
    timeFrameType?: string;

  }
  
//   // Example usage
//   const jsonExample = {
//     "id": null,
//     "method": "FBR",
//     "distributionParty": "RETAILER",
//     "latestDeliveryDate": "2023-12-22T00:00:00+00:00",
//     "exactDeliveryDate": null,
//     "expiryDate": "2023-12-25T00:00:00+00:00",
//     "timeFrameType": "REGULAR",
//   };
  
//   const deliveryScheduleInstance = ShipmentFulfilment.fromJson(jsonExample);
//   const backToJson = deliveryScheduleInstance.toJson();
  
//   console.log(deliveryScheduleInstance);
//   console.log(backToJson);
  