import ShipmentDocumentAttachmentType from "./shipment_document_attachment_type";

export interface ShipmentDocumentFileAttachmentFormData {
    type: ShipmentDocumentAttachmentType;
    src: File;
    caption?: string;
    meta: { [i: string]: string | number | boolean };
  }
  