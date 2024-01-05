import ShipmentDocumentAttachmentType from "./shipment_document_attachment_type";
import ShimentDocumentAttachmentType, { parseShipmentDocumentAttachmentType } from './shipment_document_attachment_type';

export default class ShipmentDocumentAttachment {
  id: string;
  href: string;
  type: ShimentDocumentAttachmentType;
  caption?: string;
  meta?: { [i: string]: any };

  constructor(id: string, href: string, type: ShimentDocumentAttachmentType, caption?: string, meta?: { [i: string]: any }) {
    this.id = id;
    this.caption = caption;
    this.type = type;
    this.href = href;
    this.meta = meta;
  }

  static fromJson(json: any): ShipmentDocumentAttachment {
    // console.log("JSON: ", {json})
    return new ShipmentDocumentAttachment(
      json.id,
      json.url,
      parseShipmentDocumentAttachmentType(json.type),
      json.caption,
      json.meta,// ? JSON.parse(json.meta) : undefined,
    );
  }

  toJson(): any {
    return {
      id: this.id,
      href: this.href,
      type: this.type,
      caption: this.caption,
      meta: this.meta,// ? JSON.stringify(this.meta) : undefined,
    };
  }
}


export interface ShipmentDocumentFileAttachmentFormData {
    type: ShipmentDocumentAttachmentType;
    src: File;
    caption?: string;
    meta: { [i: string]: string | number | boolean };
  }
  