export default class Money {

    id?: string;
    amount: number;
    currency: string;

    constructor({
        id,
        amount,
        currency,
    }: {
        id?: string;
        amount: number;
        currency: string;
    }) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
    }

    copyWith({
        id,
        amount,
        currency,
    }: {
        id?: string;
        amount?: number;
        currency?: string;
    }): Money {
        return new Money({
            id: id ?? this.id,
            amount: amount ?? this.amount,
            currency: currency ?? this.currency,
        });
    }

    static fromJson(json: { [key: string]: any }): Money {
        return new Money({
            id: json["id"],
            amount: json["amount"],
            currency: json["currency"],
        });
    }

    toJson(): { [key: string]: any } {
        return {
            "id": this.id,
            "amount": this.amount,
            "currency": this.currency,
        };
    }

}



export interface MoneyFormData {
    currency?: string;
    amount?: number;
}