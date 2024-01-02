import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import SmsMessage from "@/model/texting/message";
import { SmsMessageFormData } from "@/model/texting/message";
import Address from "@/model/addressing/address";

export async function getPaginatedSmsMessages({ page, limit, search }: { page?: number, limit?: number, search?: string } = {}) {
    const { data } = await http.get(`/api/texting/sms?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<SmsMessage>({
        ...data,
        buildItem: (input) => SmsMessage.fromJson(input),
    })
    return pagination;
}

export async function getSmsMessage(id: string) {
    const { data } = await http.get(`/api/texting/sms/${id}`);
    return SmsMessage.fromJson(data);
}


export async function createSmsMessage(data: SmsMessageFormData) {
    data.recipients = data.recipients?.map( e => {
        if(e instanceof Address){
            return e.phoneNumber as string;
        }
        else{
            return e;
        }
    });
    const { data: result } = await http.post(`/api/texting/sms`, data);
    return SmsMessage.fromJson(result);
}


export async function updateSmsMessage(id: string, data: SmsMessageFormData) {
    const { data: result } = await http.patch(`/api/texting/sms/${id}`, data);
    return SmsMessage.fromJson(result);
}
