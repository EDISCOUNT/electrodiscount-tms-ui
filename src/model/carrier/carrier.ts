

export default class Carrier {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
    shortDescription?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(data: {
        id?: string;
        code: string;
        name: string;
        enabled?: boolean;
        shortDescription?: string;
        description?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = data.id ?? '';
        this.code = data.code;
        this.name = data.name;
        this.enabled = data.enabled ?? false;
        this.shortDescription = data.shortDescription;
        this.description = data.description;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static fromJson(input: { [i: string]: any }): Carrier {
        return new Carrier({
            id: input.id,
            code: input.code,
            name: input.name,
            enabled: input.enabled,
            shortDescription: input.shortDescription,
            description: input.description,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        });
    }
}