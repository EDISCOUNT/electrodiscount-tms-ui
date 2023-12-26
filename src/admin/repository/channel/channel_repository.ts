import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Channel from "@/model/channel/channel";

export async function getPaginatedChannels({ page, limit, }: { page?: number, limit?: number } = {}) {
    const { data } = await http.get(`/api/admin/channel/channels?page=${page ?? 1}&limit=${limit ?? 10}`);
    const pagination = Pagination.fromJson<Channel>({
        ...data,
        buildItem: (input) => Channel.fromJson(input),
    })
    return pagination;
}

export async function getChannel(id: string) {
    const { data } = await http.get(`/api/admin/channel/channels/${id}`);
    return Channel.fromJson(data);
}


export async function createChannel(data: ChannelFormData) {
    const { data: result } = await http.post(`/api/admin/channel/channels`, data);
    return Channel.fromJson(result);
}


export async function updateChannel(id: string, data: ChannelFormData) {
    const { data: result } = await http.patch(`/api/admin/channel/channels/${id}`, data);
    return Channel.fromJson(result);
}





export interface ChannelType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}

export interface ChannelFormData {
    code: string;
    name: string;
    shortDescription: string;
    description: string;
    type: string;
    enabled: boolean;
    metadata: { [i: string]: any };
}
