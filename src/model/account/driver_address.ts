
export default class DriverAddress {
    id: string;
    company?: string;
    street?: string;
    city: string;
    provinceCode: string;
    provinceName: string;
    postcode: string;
    countryCode: string;
    updatedAt?: Date; // You might want to specify the correct data type here
    createdAt?: Date;

    constructor(data: {
        id?: string;
        company: string;
        street: string;
        city: string;
        provinceCode: string;
        provinceName: string;
        postcode: string;
        countryCode: string;
        updatedAt?: Date; // You might want to specify the correct data type here
        createdAt?: Date;
    }) {
        this.id = data.id ?? '';
        this.company = data.company;
        this.street = data.street;
        this.city = data.city;
        this.provinceCode = data.provinceCode;
        this.provinceName = data.provinceName;
        this.postcode = data.postcode;
        this.countryCode = data.countryCode;
        this.updatedAt = data.updatedAt; // You might want to specify the correct data type here
        this.createdAt = data.createdAt;
    }


    get short(): string {
        return `${this.company ?? this.city}`.trim();
    }
    get hint(): string {
        return `${this.city ?? ''}, ${this.provinceCode ?? this.provinceName ?? ''}`;
    }

    get label(): string {
        return ` ${this.street ?? ''}, ${this.city ?? ''}, ${this.postcode ?? ''}, ${this.provinceCode ?? this.provinceName ?? ''}`;
    }

    get formatted(): string {
        return `${this.company}, ${this.label}`;
    }



    toJson(): any {
        return {
            id: this.id,
            company: this.company,
            street: this.street,
            city: this.city,
            provinceCode: this.provinceCode,
            provinceName: this.provinceName,
            postcode: this.postcode,
            countryCode: this.countryCode,
            updatedAt: this.updatedAt?.toISOString(), // You might want to specify the correct data type here
            createdAt: this.createdAt?.toISOString(),
        };
    }

    static fromJson(json: any): DriverAddress {
        return new DriverAddress({
            id: json.id,
            company: json.company,
            street: json.street,
            city: json.city,
            provinceCode: json.provinceCode,
            provinceName: json.provinceName,
            postcode: json.postcode,
            countryCode: json.countryCode,
            updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined, // You might want to specify the correct data type here
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        });
    }


    static fromPlaceDetails(details: PlaceDetails): DriverAddress {
        console.log("STARTED");
        const coords = details.geometry!.location;
        const addrComps = details.address_components;

        const addressData: { [key: string]: string } = {
            city: '',
            cityCode: '',
            provinceName: '',
            provinceCode: '',
            country: '',
            countryCode: '',
            streetName: '',
            streetNumber: '',
            postcode: '',
        };

        const typeMappings: { [key: string]: keyof typeof addressData } = {
            street_number: 'streetNumber',
            route: 'streetName',
            postal_code: 'postcode',
            locality: 'city',
            administrative_area_level_1: 'province',
            country: 'country',
        };

        for (const addrComp of (addrComps ?? [])) {
            for (const name of addrComp.types) {
                const mappedKey = typeMappings[name];
                if (mappedKey) {
                    addressData[mappedKey] = addrComp.long_name;
                    addressData[`${mappedKey}Name`] = addrComp.long_name;
                    addressData[`${mappedKey}Code`] = addrComp.short_name;
                }
            }
        }

        const address = details.formatted_address;
        const street = `${addressData.streetNumber} ${addressData.streetName}`.trim();

        // console.log("ADDRESS-DETAILS:", details);
        // console.log("ADDRESS-DATA:", addressData);

        return new DriverAddress({
            company: details.name as string,
            //   name: details.name,
            street,
            city: addressData.city,
            //   cityCode: addressData.cityCode,
            provinceName: addressData.provinceName,
            provinceCode: addressData.provinceCode,
            //   country: addressData.country,
            countryCode: addressData.countryCode,
            //   address: address,
            postcode: addressData.postcode,
        });
    }

}


type PlaceDetails = google.maps.places.PlaceResult;