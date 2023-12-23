import { UserStatus } from "./user_status";

export default class User {
    id?: string;
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status?: UserStatus;
    driver: any;
    isVerified: boolean;
    isDriver?: boolean;
    createdAt?: Date;
    roles?: string[];

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        driver: any,
        isVerified: boolean,
        status?: UserStatus,
        avatar?: string,
        isDriver?: boolean,
        createdAt?: Date,
        roles?: string[],

    ) {
        this.id = id;
        this.avatar = avatar;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.driver = driver;
        this.isVerified = isVerified;
        this.isDriver = isDriver;
        this.createdAt = createdAt;
        this.roles = roles;
    }


    get fullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    static fromJson(json: any): User {
        return new User(
            json["id"],
            json["firstName"],
            json["lastName"],
            json["email"],
            json["phone"],
            json["driver"],
            json["isVerified"],
            json["status"],
            json["avatar"],
            ('driver' in json) ? (json['driver'] != null ? true : false) : undefined,
            json["createdAt"] ? new Date(json["createdAt"]) : undefined,
            json["roles"],
        );
    }

    toJson(): any {
        return {
            "id": this.id,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "email": this.email,
            "phone": this.phone,
            "driver": this.driver,
            "isVerified": this.isVerified,
            "status": this.status,
            "avatar": this.avatar,
            "isDriver": this.isDriver,
            "roles": this.roles,
            "createdAt": this.createdAt?.toISOString(),
        };
    }
}

function userFromJson(jsonString: string): User {
    const jsonObject = JSON.parse(jsonString);
    return User.fromJson(jsonObject);
}

function userToJson(data: User): string {
    return JSON.stringify(data.toJson());
}
