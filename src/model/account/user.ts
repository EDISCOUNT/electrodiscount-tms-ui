import { UserStatus } from "./user_status";

export default class User {
    id?: string;
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username?: string;
    status?: UserStatus;
    driver?: any;
    isVerified?: boolean;
    isDriver?: boolean;
    createdAt?: Date;
    roles?: string[];

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        username?: string,
        driver?: any,
        isVerified?: boolean,
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
        this.username = username;
        this.driver = driver;
        this.isVerified = isVerified;
        this.isDriver = isDriver;
        this.createdAt = createdAt;
        this.roles = roles;

        // console.log("ROLES: ", roles, this.roles);
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
            json["username"],
            json["driver"],
            json["isVerified"],
            json["status"],
            json["avatar"],
            ('driver' in json) ? (json['driver'] != null ? true : false) : undefined,
            json["createdAt"] ? new Date(json["createdAt"]) : undefined,
            json["roles"],
        );
    }

    toJson(): UserFormData {
        return {
            "firstName": this.firstName,
            "lastName": this.lastName,
            "username": this.username,
            "email": this.email,
            "phone": this.phone,
            "isVerified": this.isVerified,
            "avatar": this.avatar,
            "roles": this.roles,
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



export interface UserFormData {
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username?: string;
    // status?: UserStatus;
    // driver: any;
    isVerified?: boolean;
    password?: string;
    // isDriver?: boolean;
    // createdAt?: Date;
    roles?: string[];
}