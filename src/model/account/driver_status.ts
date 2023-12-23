export enum DriverStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    SUSPENDED = "SUSPENDED",
}

interface DriverStatusDefinition {
    name: DriverStatus;
    iconImage: string;
    coverImage: string;
}

export function parseDriverStatus(name: string): DriverStatus {
    switch (name) {
        case DriverStatus.PENDING:
            return DriverStatus.PENDING;

        case DriverStatus.ACTIVE:
            return DriverStatus.ACTIVE;

        case DriverStatus.DISABLED:
            return DriverStatus.DISABLED;

        case DriverStatus.SUSPENDED:
            return DriverStatus.SUSPENDED;
            
        default:
            throw new Error(`Could not parse ${name} into DriverStatus enum`);
    }
}
