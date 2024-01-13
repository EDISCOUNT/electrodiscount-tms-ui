import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import EmailMessageTemplate, { EmailMessageTemplateFormData } from "@/model/mailing/message_template";

export async function getPaginatedEmailMessageTemplates({ page, limit, search }: { page?: number, limit?: number, search?: string } = {}) {
    const { data } = await http.get(`/api/mailing/message_templates?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<EmailMessageTemplate>({
        ...data,
        buildItem: (input) => EmailMessageTemplate.fromJson(input),
    })
    return pagination;
}

export async function getEmailMessageTemplate(id: string) {
    const { data } = await http.get(`/api/mailing/message_templates/${id}`);
    return EmailMessageTemplate.fromJson(data);
}


export async function createEmailMessageTemplate(data: EmailMessageTemplateFormData) {
    const { data: result } = await http.post(`/api/mailing/message_templates`, data);
    return EmailMessageTemplate.fromJson(result);
}


export async function updateEmailMessageTemplate(id: string, data: EmailMessageTemplateFormData) {
    const { data: result } = await http.patch(`/api/mailing/message_templates/${id}`, data);
    return EmailMessageTemplate.fromJson(result);
}


export async function deleteEmailMessageTemplate(id: string,) {
    const { data: result } = await http.delete(`/api/mailing/message_templates/${id}`);
}


