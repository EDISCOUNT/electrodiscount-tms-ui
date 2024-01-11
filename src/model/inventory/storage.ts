import Address from "../addressing/address";

export default class Storage {


    id?: string;
    code?: string;
    name?: string;
    address?: Address;
    enabled?: boolean;

    constructor({
        id,
        code,
        name,
        address,
        enabled,
    }: {
        id?: any;
        code?: any;
        address?: Address;
        name?: string;
        price?: any;
        enabled?: boolean;
    }) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.address = address;
        this.enabled = enabled;
    }

    copyWith({
        id,
        code,
        name,
        address,
        enabled,
    }: {
        id?: any;
        code?: any;
        name?: string;
        address?: Address;
        enabled?: boolean;
    }): Storage {
        return new Storage({
            id: id ?? this.id,
            code: code ?? this.code,
            name: name ?? this.name,
            address: address?? this.address,
            enabled: enabled ?? this.enabled,
        });
    }

    static fromJson(json: { [key: string]: any }): Storage {
        return new Storage({
            id: json["id"],
            code: json["code"],
            name: json["name"],
            address: json["address"]? Address.fromJson(json['address']) : undefined,
            enabled: json["enabled"],
        });
    }

    toJson(): { [key: string]: any } {
        return {
            "id": this.id,
            "code": this.code,
            "name": this.name,
            "enabled": this.enabled,
        };
    }
}




 
  
//   class Storage {
//     id: number;
//     code: string;
//     gtin: string;
//     name: string;
//     price: any;
  
//     constructor({
//       id,
//       code,
//       gtin,
//       name,
//       price,
//     }: {
//       id: number;
//       code: string;
//       gtin: string;
//       name: string;
//       price: any;
//     }) {
//       this.id = id;
//       this.code = code;
//       this.gtin = gtin;
//       this.name = name;
//       this.price = price;
//     }
  
//     copyWith({
//       id,
//       code,
//       gtin,
//       name,
//       price,
//     }: {
//       id?: number;
//       code?: string;
//       gtin?: string;
//       name?: string;
//       price?: any;
//     }): Storage {
//       return new Storage({
//         id: id ?? this.id,
//         code: code ?? this.code,
//         gtin: gtin ?? this.gtin,
//         name: name ?? this.name,
//         price: price ?? this.price,
//       });
//     }
  
//     static fromJson(json: Record<string, any>): Storage {
//       return new Storage({
//         id: json["id"],
//         code: json["code"],
//         gtin: json["gtin"],
//         name: json["name"],
//         price: json["price"],
//       });
//     }
  
//     toJson(): Record<string, any> {
//       return {
//         "id": this.id,
//         "code": this.code,
//         "gtin": this.gtin,
//         "name": this.name,
//         "price": this.price,
//       };
//     }
//   }
  