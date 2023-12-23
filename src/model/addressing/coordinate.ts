
export default class Coords {
    latitude: number;
    longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    static fromJson(json: any): Coords {
        return new Coords(json.latitude, json.longitude);
    }

    toLatLng() {
        return {
            lat: this.latitude,
            lng: this.longitude,
        };
    }

    toJson(): CoordsFormData {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
        };
    }

    toString(){
        return `${this.latitude},${this.longitude}`;
    }
}



export interface CoordsFormData{
    
    latitude: number;
    longitude: number;
}