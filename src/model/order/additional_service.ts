

export default class AdditionalService {
    id: string;
    code: string;
    title: string;
    enabled: boolean;
    shortDescription?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    
    constructor(data: {
        id?: string;
        code: string;
        title: string;
        enabled?: boolean;
        shortDescription?: string;
        description?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = data.id ?? '';
        this.code = data.code;
        this.title = data.title;
        this.enabled = data.enabled ?? false;
        this.shortDescription = data.shortDescription;
        this.description = data.description;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static fromJson(input: {[i:string]: any} ): AdditionalService{
        return new AdditionalService({
            id: input.id,
            code: input.code,
            title: input.title,
            enabled: input.enabled,
            shortDescription: input.shortDescription,
            description: input.description,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        });
    }
}