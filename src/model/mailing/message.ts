import Address from "../addressing/address";
import EmailAddress from "./email_address";
import EmailAttachment, { EmailAttachmentFormData } from "./email_attachment";
import Shipment from '@/model/shipment/shipment';

export default class EmailMessage {
    id?: string;
    subject?: string;
    message?: string;
    recipients?: (string | EmailAddress)[];
    ccRecipients?: (string | EmailAddress)[];
    bccRecipients?: (string | EmailAddress)[];
    attachments?: EmailAttachment[];

    constructor({ id, subject, message, recipients, ccRecipients, bccRecipients, attachments }: { id?: string, subject?: string, message?: string, recipients?: (string | EmailAddress)[], ccRecipients?: (string | EmailAddress)[], bccRecipients?: (string | EmailAddress)[], attachments?: EmailAttachment[] } = {}) {
        this.id = id;
        this.subject = subject;
        this.message = message;
        this.recipients = recipients;
        this.ccRecipients = ccRecipients;
        this.bccRecipients = bccRecipients;
        this.attachments = attachments;
    }


    static fromJson(data: Record<string, any>) {
        return new EmailMessage({
            id: data.id,
            subject: data.subject,
            message: data.message,
            recipients: data.recipients?.map((item: any) => EmailAddress.fromJson(item)),
            ccRecipients: data.ccRecipients?.map((item: any) => EmailAddress.fromJson(item)),
            bccRecipients: data.bccRecipients?.map((item: any) => EmailAddress.fromJson(item)),
            attachments: data.attachments?.map((item: any) => EmailAttachment.fromJson(item))
        })
    }


}


export interface EmailMessageFormData {
    subject: string;
    message?: string;
    recipients: (string | EmailAddress | Address)[];
    ccRecipients?: (string | EmailAddress | Address)[];
    bccRecipients?: (string | EmailAddress | Address)[];
    attachments?: EmailAttachmentFormData[];
    //
    label?: string;
    saveAsTemplate?: boolean;
    // 
    shipment?: Shipment;
}