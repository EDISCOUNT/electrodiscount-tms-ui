

export default class AdditionalService {
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
}