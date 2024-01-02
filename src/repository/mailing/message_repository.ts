import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import EmailMessage from "@/model/mailing/message";
import { EmailMessageFormData } from "@/model/mailing/message";
import EmailAddress from "@/model/mailing/email_address";
import Address from "@/model/addressing/address";

export async function getPaginatedEmailMessages({ page, limit, search }: { page?: number, limit?: number, search?: string } = {}) {
    const { data } = await http.get(`/api/mailing/messages?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<EmailMessage>({
        ...data,
        buildItem: (input) => EmailMessage.fromJson(input),
    })
    return pagination;
}

export async function getEmailMessage(id: string) {
    const { data } = await http.get(`/api/mailing/messages/${id}`);
    return EmailMessage.fromJson(data);
}


export async function createEmailMessage(data: EmailMessageFormData) {


    const recipients = data.recipients?.map(normalizeAddress);
    const ccRecipients = data.ccRecipients?.map(normalizeAddress);
    const bccRecipients = data.bccRecipients?.map(normalizeAddress);

    const formData = new FormData();
    formData.append('subject', data.subject);
    if (data.message) {
        formData.append('message', data.message);
    }
    formData.append('saveAsTemplate', Boolean(data.saveAsTemplate).toString());
    if (data.label) {
        formData.append('label', data.label);
    }
    recipients?.forEach((address, index) => appendAddress(formData, `recipients[${index}]`, address));
    ccRecipients?.forEach((address, index) => appendAddress(formData, `ccRecipients[${index}]`, address));
    bccRecipients?.forEach((address, index) => appendAddress(formData, `bccRecipients[${index}]`, address));

    data.attachments?.forEach((attachment, index) => {
        formData.append(`attachments[${index}][file]`, attachment.file);
        // formData.append(`attachments[${index}][filename]`, attachment.filename);
    });

    const { data: result } = await http.post(`/api/mailing/messages`, formData);
    return EmailMessage.fromJson(result);
}


export async function updateEmailMessage(id: string, data: EmailMessageFormData) {
    const { data: result } = await http.patch(`/api/mailing/messages/${id}`, data);
    return EmailMessage.fromJson(result);
}



function appendAddress(formData: FormData, name: string, address: NormalizedAddress) {
    formData.append(`${name}[emailAddress]`, address.email);
    if (address.fullName) {
        formData.append(`${name}[fullName]`, address.fullName);
    }
}


function normalizeAddress(address: (string | EmailAddress | Address)): NormalizedAddress {
    if (typeof (address) === 'string') {
        return { email: address };
    }
    else if (address instanceof EmailAddress) {
        return { email: address.email!, fullName: address.name };
    }
    else if (address instanceof Address) {
        return { email: address.emailAddress!, fullName: address.fullName };
    }
    else {
        return address;
    }
}



interface NormalizedAddress { email: string, fullName?: string };
