

export default class Channel {
    id: string;
    code: string;
    name: string;
    type: string;
    typeConfig: { [i: string]: any };
    metadata: { [i: string]: any };
    enabled: boolean;
    shortDescription?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data: {
        id?: string;
        code: string;
        name: string;
        type: string;
        typeConfig?: { [i: string]: any };
        metadata?: { [i: string]: any };
        enabled?: boolean;
        shortDescription?: string;
        description?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = data.id ?? '';
        this.code = data.code;
        this.name = data.name;
        this.type = data.type;
        this.typeConfig = data.typeConfig ?? {};
        this.metadata = data.metadata ?? {};
        this.enabled = data.enabled ?? false;
        this.shortDescription = data.shortDescription;
        this.description = data.description;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}