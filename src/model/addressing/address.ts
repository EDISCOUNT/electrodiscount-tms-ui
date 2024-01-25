import Coords, { CoordsFormData } from "./coordinate";

export default class Address {
    id: string;
    googleId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    company?: string;
    street?: string;
    city?: string;
    provinceCode?: string;
    provinceName?: string;
    postcode: string;
    countryCode: string;
    coordinates?: Coords;
    arriveAt?: Date;
    updatedAt?: Date; // You might want to specify the correct data type here
    createdAt?: Date;

    constructor(data: {
        id?: string;
        googleId?: string;
        firstName?: string;
        lastName?: string;
        emailAddress?: string;
        phoneNumber?: string;
        company?: string;
        street?: string;
        city?: string;
        provinceCode?: string;
        provinceName?: string;
        postcode: string;
        countryCode: string;
        coordinates?: Coords;
        arriveAt?: Date;
        updatedAt?: Date; // You might want to specify the correct data type here
        createdAt?: Date;
    }) {
        this.id = data.id ?? '';
        this.googleId = data.googleId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.emailAddress = data.emailAddress;
        this.phoneNumber = data.phoneNumber;
        this.company = data.company;
        this.street = data.street;
        this.city = data.city;
        this.provinceCode = data.provinceCode;
        this.provinceName = data.provinceName;
        this.postcode = data.postcode;
        this.countryCode = data.countryCode;
        this.coordinates = data.coordinates;
        this.arriveAt = data.arriveAt;
        this.updatedAt = data.updatedAt; // You might want to specify the correct data type here
        this.createdAt = data.createdAt;
    }


    get short(): string {
        return `${this.fullName} ${this.company ?? this.city}`.trim();
    }
    get hint(): string {
        return `${this.city ?? ''}, ${this.provinceCode ?? this.provinceName ?? ''}`;
    }

    get label(): string {
        return ` ${this.street ?? ''}, ${this.postcode ?? ''}, ${this.city ?? ''}, ${(this.provinceName?? this.provinceCode) ? `${this.provinceName?? this.provinceCode},` : ''} ${this.countryCode ?? ''}`;
    }

    get formatted(): string {
        return `${this.company ? `${this.company},` : ''} ${this.label}`;
    }

    get fullName(): string {
        return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
    }

    get reference(): string {
        return this.googleId || this.coordinates?.toString() || this.company || this.street || '';
    }

    public get province() {
        return this.provinceCode ?? this.provinceName;
    }


    toJson(): AddressFormData {
        return {
            googleId: this.googleId,
            firstName: this.firstName,
            lastName: this.lastName,
            emailAddress: this.emailAddress,
            phoneNumber: this.phoneNumber,
            company: this.company,
            street: this.street,
            city: this.city,
            provinceCode: this.provinceCode,
            provinceName: this.provinceName,
            postcode: this.postcode,
            countryCode: this.countryCode,
            coordinates: this.coordinates?.toJson(),
            // arriveAt: this.arriveAt?.toISOString(),
            // updatedAt: this.updatedAt?.toISOString(), // You might want to specify the correct data type here
            // createdAt: this.createdAt?.toISOString(),
        };
    }

    static fromJson(json: any): Address {
        return new Address({
            id: json.id,
            googleId: json.googleId,
            firstName: json.firstName,
            lastName: json.lastName,
            emailAddress: json.emailAddress,
            phoneNumber: json.phoneNumber,
            company: json.company,
            street: json.street,
            city: json.city,
            provinceCode: json.provinceCode ?? json.provinceName,
            provinceName: json.provinceName ?? json.provinceCode,
            postcode: json.postcode,
            countryCode: json.country ?? json.countryCode,
            coordinates: json.coordinate ? Coords.fromJson(json.coordinate) : undefined,
            arriveAt: json.arriveAt ? new Date(json.arriveAt) : undefined,
            updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined, // You might want to specify the correct data type here
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        });
    }


    static fromFormatted(address: string): Address {
        const parts = address.split(',');
        const company = parts[0]?.trim();
        const street = parts[1]?.trim();
        const city = parts[2]?.trim();
        const province = parts[3]?.trim();
        const postcode = parts[4]?.trim();
        const country = parts[5]?.trim();

        return new Address({
            company,
            street,
            city,
            provinceCode: province,
            postcode,
            countryCode: country,
        });
    }

    // static parse(address: string): ?Address {}


    static fromPlaceDetails(details: PlaceDetails): Address {
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

        return new Address({
            company: details.name as string,
            googleId: details.place_id,
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
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
            coordinates: Coords.fromJson({ latitude: coords?.lat(), longitude: coords?.lng() }),
        });
    }

}


type PlaceDetails = google.maps.places.PlaceResult;



export interface AddressFormData {

    googleId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    company?: string;
    street?: string;
    city?: string;
    provinceCode?: string;
    provinceName?: string;
    postcode?: string;
    countryCode?: string;
    coordinates?: CoordsFormData;
    arriveAt?: string;
}