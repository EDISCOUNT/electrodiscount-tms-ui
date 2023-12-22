export default class PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;

    constructor(data: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    }) {
        this.hasNextPage = data.hasNextPage;
        this.hasPreviousPage = data.hasPreviousPage;
        this.startCursor = data.startCursor;
        this.endCursor = data.endCursor;
    }

    static fromJson(json: any): PageInfo {
        return new PageInfo({
            hasNextPage: json.hasNextPage,
            hasPreviousPage: json.hasPreviousPage,
            startCursor: json.startCursor,
            endCursor: json.endCursor,
        });
    }

    toJson(): any {
        return {
            hasNextPage: this.hasNextPage,
            hasPreviousPage: this.hasPreviousPage,
            startCursor: this.startCursor,
            endCursor: this.endCursor,
        };
    }
}

