import User from "../account/user";
import EmailAttachment, { EmailAttachmentFormData } from "./email_attachment";

export default class EmailMessageTemplate {
    id?: string;
    label?: string;
    subject?: string;
    message?: string;
    attachments?: EmailAttachment[];
    owner?: User;
    enabled: boolean;

    constructor({ id, label, subject, message, owner, attachments, enabled }: { id?: string, label?: string; subject?: string, message?: string, owner?: User, attachments?: EmailAttachment[], enabled: boolean } = { enabled: false }) {
        this.id = id;
        this.subject = subject;
        this.message = message;
        this.attachments = attachments;
        this.owner = owner;
        this.label = label;
        this.enabled = enabled;
    }


    static fromJson(data: Record<string, any>) {
        return new EmailMessageTemplate({
            id: data.id,
            subject: data.subject,
            label: data.label,
            message: data.message,
            attachments: data.attachments?.map((item: any) => EmailAttachment.fromJson(item)),
            owner: data.owner ? User.fromJson(data.owner) : undefined,
            enabled: data.enabled ?? false,
        })
    }


}


export interface EmailMessageTemplateFormData {
    label?: string;
    subject: string;
    message?: string;
    attachments?: EmailAttachmentFormData[];
    enabled: boolean;
}