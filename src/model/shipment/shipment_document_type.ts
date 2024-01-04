

export enum ShipmentDocumentType {
    PUC = "PUC",
    POD = 'POD'
}

export default ShipmentDocumentType;

export function parseShipmentDocumentType(name: string): ShipmentDocumentType {
    switch (name) {
        case 'PUC':
            return ShipmentDocumentType.PUC;
        case 'POD':
            return ShipmentDocumentType.POD;
    }
    throw new Error(`Could not parse ${name} into ShipmentDocumentType enum`);
}
