import http from "@/plugins/http";
import Pagination from "@/data/pagination/pagination";
import Shipment, { ShipmentFormData } from '@/model/shipment/shipment';
import { deepEncodeURLParams, encodeURLParams } from "@/utils/url";
import { ShipmentDocumentFileAttachmentFormData } from "@/model/shipment/shipment_document_attachment";
import { and, comparison, inList } from "rsql-builder";

export async function getPaginatedShipments({ page, limit, criteria }: { page?: number, limit?: number, criteria?: { [i: string]: any } } = {}) {
    criteria ??= {};
    criteria = { ...criteria };
    // console.log("criteria: ", { criteria })
    if ('status' in criteria) {
        if (criteria['status'] == 0) {
            delete criteria['status'];
        }
    }
    // if ('dateRange' in criteria) {
    //    criteria['dateRange'] =  JSON.stringify(criteria['dateRange']);
    // }
    if (('status' in criteria) && criteria.status) {
        let status: string[] = criteria.status;
        if (!Array.isArray(status)) {
            status = [status];
        }
        // let filter = criteria.filter ?? '';
        // filter = and(
        //     filter,
        //     comparison('status', inList(...status)),
        // );
        // criteria.filter = filter;
        // delete criteria.status;
    }
    const query = deepEncodeURLParams({
        ...criteria,
        page,
        limit
    });
    const { data } = await http.get(`/api/carrier/shipment/shipments?${query}`);
    const pagination = Pagination.fromJson<Shipment>({
        ...data,
        buildItem: (input) => Shipment.fromJson(input),
    })
    return pagination;
}


export async function countShipments({ criteria }: { page?: number, limit?: number, criteria?: { [i: string]: any } } = {}) {
    criteria ??= {};
    criteria = { ...criteria };
    // console.log("criteria: ", { criteria })
    if ('status' in criteria) {
        if (criteria['status'] == 0) {
            delete criteria['status'];
        }
    }
    // if ('dateRange' in criteria) {
    //    criteria['dateRange'] =  JSON.stringify(criteria['dateRange']);
    // }
    if (('status' in criteria) && criteria.status) {
        let status: string[] = criteria.status;
        if (!Array.isArray(status)) {
            status = [status];
        }
        let filter = criteria.filter ?? '';
        filter = and(
            filter,
            comparison('status', inList(...status)),
        );
        criteria.filter = filter;
        // delete criteria.status;
    }
    const query = deepEncodeURLParams({
        ...criteria,
    });
    const { data } = await http.get(`/api/carrier/shipment/shipments/count?${query}`);
    return data as { count: number };
}



export async function getShipment(id: string) {
    const { data } = await http.get(`/api/carrier/shipment/shipments/${id}`);
    return Shipment.fromJson(data);
}



export async function generatePacklist({ shipments }: { shipments: string[] }) {
    const { data } = await http.post(`/api/carrier/shipment/shipments/operation/generate-packlist`, { shipments });
    return data as { url: string };
}

export async function generateExportUrl({ shipments }: { shipments: string[] }) {
    const { data } = await http.post(`/api/carrier/shipment/shipments/operation/export`, { shipments });
    return data as { url: string };
}


export async function applyTransition({ shipment, transition, attachments, description }: { shipment: Shipment, transition: string, attachments?: ShipmentDocumentFileAttachmentFormData[], description?: string }) {
    const { id } = shipment;
    const formData = new FormData();
    formData.append('transition', transition);
    if (description) {
        formData.append(`description`, description);
    }
    attachments?.forEach(({ src: file, caption, type, meta }, index) => {
        formData.append(`attachments[${index}][file]`, file);
        formData.append(`attachments[${index}][type]`, type);
        if (caption) {
            formData.append(`attachments[${index}][caption]`, caption);
        }
        if (meta) {
            formData.append(`attachments[${index}][meta]`, JSON.stringify(meta));
        }
    })
    const { data } = await http.post(`/api/carrier/shipment/shipments/${id}/apply-transition`, formData);
    return Shipment.fromJson(data);
}




interface BulkApplyShipmentTransitionInput {
    shipments: (Shipment | string | number)[],
    description?: string,
    transition: string,
    attachments?: ShipmentDocumentFileAttachmentFormData[]
}

export async function bulkApplyTransition({ shipments: _shipments, description, transition, attachments }: BulkApplyShipmentTransitionInput) {
    const shipments = _shipments?.map((shipment) => (shipment instanceof Shipment) ? shipment.id : shipment)?.map(e => String(e));
    const formData = new FormData();
    formData.append('transition', transition);
    if (description) {
        formData.append('description', description);
    }
    attachments?.forEach(({ src: file, type, caption }, index) => {
        formData.append(`attachments[${index}][type]`, type);
        formData.append(`attachments[${index}][file]`, file);
        if (caption) {
            formData.append(`attachments[${index}][caption]`, caption);
        }
    })
    shipments.forEach((id, index) => {
        formData.append(`shipments[${index}]`, id);
    });
    const { data } = await http.post(`/api/carrier/shipment/shipments/apply-transition`, formData);
    // return Shipment.fromJson(data);
    return data as string[];
}




export async function createShipment(data: ShipmentFormData) {
    const { data: result } = await http.post(`/api/carrier/shipment/shipments`, data);
    return Shipment.fromJson(result);
}


export async function updateShipment(id: string, data: ShipmentFormData) {
    const { data: result } = await http.patch(`/api/carrier/shipment/shipments/${id}`, data);
    return Shipment.fromJson(result);
}





export interface ShipmentType {
    title: string;
    subtitle: string;
    iconImage: string;
    code: string;
}
