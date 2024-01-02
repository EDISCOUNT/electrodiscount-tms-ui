import Address from "../addressing/address";

export default class SmsMessage {
    id?: string;
    recipients?: (string)[];
    message?: string;

    constructor({ id, message, recipients, }: { id?: string, subject?: string, message?: string, recipients?: string[], } = {}) {
        this.id = id;
        this.message = message;
        this.recipients = recipients;
    }


    static fromJson(data: Record<string, any>) {
        return new SmsMessage({
            id: data.id,
            subject: data.subject,
            message: data.message,
            recipients: data.recipients,
        });
    }


}


export interface SmsMessageFormData {
    // subject: string;
    message?: string;
    recipients: (string | Address)[];
    // recipients: string[];
}