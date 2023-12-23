import ReviewSummary from "./review_summary";
import { DriverStatus, parseDriverStatus } from "./driver_status";
import User from "./user";

export default class Driver {
    id?: string;
    user?: User;
    isVerified: boolean;
    status?: DriverStatus;
    review?: ReviewSummary;
    updatedAt?: Date;
    createdAt?: Date;


    constructor(
        { id, user, isVerified, status, review, updatedAt, createdAt }:
            {
                id?: string,
                user?: User,
                isVerified: boolean,
                status?: DriverStatus,
                review?: ReviewSummary,
                updatedAt?: Date;
                createdAt?: Date;
            }
    ) {
        this.id = id;
        this.user = user;
        this.isVerified = isVerified;
        this.status = status;
        this.review = review;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    get fullName(): string {
        return `${this.user?.firstName ?? ''} ${this.user?.lastName ?? ''}`.trim();
    }

    static fromJson(json: any): Driver {
        return new Driver(
            {
                id: json["id"],
                user: json["user"] ? User.fromJson(json['user']) : undefined,
                isVerified: json["isVerified"],
                status: json['status'] ? parseDriverStatus(json['status']) : undefined,
                review: json['review'] ? ReviewSummary.fromJson(json['review']) : undefined,
                updatedAt: json['updatedAt'] ? new Date(json['updatedAt']) : undefined,
                createdAt: json['createdAt'] ? new Date(json['createdAt']) : undefined,
            }
        );
    }

    toJson(): any {
        return {
            "id": this.id,
            "user": this.user,
            "isVerified": this.isVerified,
            "review": this.review?.toJson(),
            "status": this.status,
        };
    }
}

function driverFromJson(jsonString: string): Driver {
    const jsonObject = JSON.parse(jsonString);
    return Driver.fromJson(jsonObject);
}

function driverToJson(data: Driver): string {
    return JSON.stringify(data.toJson());
}
