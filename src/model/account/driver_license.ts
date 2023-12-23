
export default class DriverLicense {
    id: string;
    fullName?: string;
    licenseNumber?: string;
    issuanceState: string;
    licenseClass: string;
    issueDate?: Date;
    expiryDate?: Date;
    countryCode: string;
    updatedAt?: Date; // You might want to specify the correct data type here
    createdAt?: Date;

    constructor(data: {
        id?: string;
        fullName: string;
        licenseNumber: string;
        issuanceState: string;
        licenseClass: string;
        countryCode: string;
        issueDate?: Date;
        expiryDate?: Date,
        updatedAt?: Date; // You might want to specify the correct data type here
        createdAt?: Date;
    }) {
        this.id = data.id ?? '';
        this.fullName = data.fullName;
        this.licenseNumber = data.licenseNumber;
        this.issuanceState = data.issuanceState;
        this.licenseClass = data.licenseClass;
        this.issueDate = data.issueDate;
        this.expiryDate = data.expiryDate;
        this.countryCode = data.countryCode;
        this.updatedAt = data.updatedAt; // You might want to specify the correct data type here
        this.createdAt = data.createdAt;
    }



    toJson(): any {
        return {
            id: this.id,
            fullName: this.fullName,
            licenseNumber: this.licenseNumber,
            issuanceState: this.issuanceState,
            licenseClass: this.licenseClass,
            issueDate: this.issueDate,
            expiryDate: this.expiryDate,
            countryCode: this.countryCode,
            updatedAt: this.updatedAt?.toISOString(), // You might want to specify the correct data type here
            createdAt: this.createdAt?.toISOString(),
        };
    }

    static fromJson(json: any): DriverLicense {
        return new DriverLicense({
            id: json.id,
            fullName: json.fullName,
            licenseNumber: json.licenseNumber,
            issuanceState: json.issuanceState,
            licenseClass: json.licenseClass,
            countryCode: json.countryCode,
            expiryDate: json.expiresAt? new Date(json.expiresAt) : undefined,
            issueDate: json.issueDate? new Date(json.issueDate) : undefined,
            updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined, // You might want to specify the correct data type here
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
        });
    }

}
