export default class ShipmentFulfilmentTimeRange {
    startAt: Date;
    endAt: Date;
    constructor({ startAt, endAt }: { startAt: Date, endAt: Date }) {
        this.startAt = startAt;
        this.endAt = endAt;
    }

    get duration(): number {
        return this.endAt.getTime() - this.startAt.getTime();
    }

    static fromJson(json: any): ShipmentFulfilmentTimeRange {
        return new ShipmentFulfilmentTimeRange({
            startAt: new Date(json.startAt),
            endAt: new Date(json.endAt)
        })
    }

    toJson(): any {
        return {
            startAt: this.startAt.toISOString(),
            endAt: this.endAt.toISOString()
        }
    }

}




export interface ShipmentFulfilmentTimeRangeFormData {
    startAt?: string | Date;
    endAt?: string | Date;
}
