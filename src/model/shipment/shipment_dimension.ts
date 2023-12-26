export default class ShipmentDimension {
    length: number;
    width: number;
    height: number;
    unit?: string;
    constructor({ length, width, height, unit }: { length: number; width: number; height: number; unit: string }) {
        this.length = length;
        this.width = width;
        this.height = height;
        this.unit = unit;
    }


    public get label(): string {
        return `${this.length} x ${this.width} x ${this.height} ${this.unit ?? ''}`;
    }

    getVolume(): number {
        return this.length * this.width * this.height;
    }


    static fromJson(json: Record<string, any>): ShipmentDimension {
        return new ShipmentDimension({
            length: json.length,
            width: json.width,
            height: json.height,
            unit: json.unit,
        });
    }

    toJson(): ShipmentDimensionFormData {
        return {
            length: this.length,
            width: this.width,
            height: this.height,
            unit: this.unit,
        };
    }

}


export interface ShipmentDimensionFormData {
    length: number;
    width: number;
    height: number;
    // weight?: number;
    unit?: string;
}