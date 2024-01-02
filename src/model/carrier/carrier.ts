import User from "../account/user";


export default class Carrier {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
    logo?: string;
    emailAddress?: string;
    phoneNumber?: string;
    shortDescription?: string;
    description?: string;
    operatorUser?: User;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(data: {
        id?: string;
        code: string;
        name: string;
        enabled?: boolean;
        logo?: string,
        emailAddress?: string;
        phoneNumber?: string;
        shortDescription?: string;
        description?: string;
        operatorUser?: User;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = data.id ?? '';
        this.code = data.code;
        this.name = data.name;
        this.enabled = data.enabled ?? false;
        this.logo = data.logo;
        this.emailAddress = data.emailAddress;
        this.phoneNumber = data.phoneNumber;
        this.shortDescription = data.shortDescription;
        this.description = data.description;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.operatorUser = data.operatorUser;
    }

    static fromJson(input: { [i: string]: any }): Carrier {
        return new Carrier({
            id: input.id,
            code: input.code,
            name: input.name,
            enabled: input.enabled,
            logo: input.logo,
            shortDescription: input.shortDescription,
            description: input.description,
            emailAddress: input.emailAddress,
            phoneNumber: input.phoneNumber,
            operatorUser: input.operatorUser ? User.fromJson(input.operatorUser) : undefined,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        });
    }
}