

export enum ShipmentDocumentAttachmentType {
    IMAGE = "IMAGE",
    SIGNATURE = 'SIGNATURE'
}

export default ShipmentDocumentAttachmentType;

export function parseShipmentDocumentAttachmentType(name: string): ShipmentDocumentAttachmentType {
    switch (name) {
        case 'IMAGE':
            return ShipmentDocumentAttachmentType.IMAGE;
        case 'SIGNATURE':
            return ShipmentDocumentAttachmentType.SIGNATURE;
    }
    throw new Error(`Could not parse ${name} into ShipmentDocumentAttachmentType enum`);
}
