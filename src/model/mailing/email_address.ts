export default class EmailAddress{
    id?: string;
    email?: string;
    name?: string;

    constructor({id, email, name}: {id?: string, email?: string, name?: string} = {}){
        this.id = id;
        this.email = email;
        this.name = name;
    }

    static fromJson(data: Record<string, any>){
        return new EmailAddress({
            id: data.id,
            email: data.email,
            name: data.name
        })
    }

    toJson(){
        return {
            // id: this.id,
            email: this.email,
            name: this.name
        }
    }
}

export interface EmailAddressFormData{
    email: string;
    name?: string;
}