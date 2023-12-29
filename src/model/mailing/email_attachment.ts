export default class EmailAttachment{
    id?: string;
    name?: string;
    url?: string;
    size?: number;
    type?: string;

    constructor({id, name, url, size, type}: {id?: string, name?: string, url?: string, size?: number, type?: string} = {}){
        this.id = id;
        this.name = name;
        this.url = url;
        this.size = size;
        this.type = type;
    }

    static fromJson(data: Record<string, any>){
        return new EmailAttachment({
            id: data.id,
            name: data.name,
            url: data.url,
            size: data.size,
            type: data.type
        })
    }

    toJson(){
        return {
            // id: this.id,
            name: this.name,
            url: this.url,
            size: this.size,
            type: this.type
        }
    }
}



export interface EmailAttachmentFormData{
    file: File;
    caption?: string;
}