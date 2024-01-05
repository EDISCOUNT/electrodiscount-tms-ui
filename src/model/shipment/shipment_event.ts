import ShipmentDocumentAttachment from "./shipment_document_attachment";

export default class ShipmentEvent {
    id?: string;
    code?: string;
    type?: string;
    title: string;
    subtitle?: string;
    description?: string;
    eventOccuredAt?: Date;
    createdAt?: Date;
    attachments: ShipmentDocumentAttachment[];
    metadata?: Record<string, any>;


    constructor({ id, code, type, title, subtitle, description, eventOccuredAt, createdAt, attachments, metadata }: { id?: string; code?: string; type?: string; title: string; subtitle?: string; description?: string; eventOccuredAt?: Date; createdAt?: Date; attachments?: ShipmentDocumentAttachment[]; metadata?: Record<string, any>; }) {
        this.id = id;
        this.code = code;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.eventOccuredAt = eventOccuredAt;
        this.createdAt = createdAt;
        this.attachments = attachments ?? [];
        this.metadata = metadata;
    }


    static fromJson(json: Record<string, any>): ShipmentEvent {
        return new ShipmentEvent({
            id: json.id,
            code: json.code,
            type: json.type,
            title: json.title,
            subtitle: json.subtitle,
            description: json.description,
            eventOccuredAt: json.eventOccuredAt ? new Date(json.eventOccuredAt) : undefined,
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
            attachments: json.attachments?.map((e: any) => ShipmentDocumentAttachment.fromJson(e)) ?? [],
            metadata: json.metadata,
        });
    }


    toJson(): Record<string, any> {
        return {
            id: this.id,
            code: this.code,
            type: this.type,
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
            eventOccuredAt: this.eventOccuredAt,
            createdAt: this.createdAt,
            metadata: this.metadata,
        };
    }
}