export enum UserStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    SUSPENDED = "SUSPENDED",
}

interface UserStatusDefinition {
    name: UserStatus;
    iconImage: string;
    coverImage: string;
}

export function parseUserStatus(name: string): UserStatus {
    switch (name) {
        case UserStatus.PENDING:
            return UserStatus.PENDING;

        case UserStatus.ACTIVE:
            return UserStatus.ACTIVE;

        case UserStatus.DISABLED:
            return UserStatus.DISABLED;

        case UserStatus.SUSPENDED:
            return UserStatus.SUSPENDED;
            
        default:
            throw new Error(`Could not parse ${name} into UserStatus enum`);
    }
}
