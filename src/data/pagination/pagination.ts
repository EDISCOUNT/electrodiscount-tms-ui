// import Edge from "./edge";
// import PageInfo from "./page_info";
import { Node } from "./types";


type JsonInput = { [i: string]: any };


class PageInfo{
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    perPage: number;
    totalItems: number;


    constructor(data: {
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        perPage: number;
        totalItems: number;
    }) {
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.hasNextPage = data.hasNextPage;
        this.hasPreviousPage = data.hasPreviousPage;
        this.perPage = data.perPage;
        this.totalItems = data.totalItems;
    }

    toJson(): any {
        return {
            current_page: this.currentPage,
            total_pages: this.totalPages,
            has_next_page: this.hasNextPage,
            has_previous_page: this.hasPreviousPage,
            per_page: this.perPage,
            total_items: this.totalItems,
        };
    }

    static fromJson(data: any): PageInfo {
        return new PageInfo({
            currentPage: data.current_page,
            totalPages: data.total_pages,
            hasNextPage: data.has_next_page,
            hasPreviousPage: data.has_previous_page,
            perPage: data.per_page,
            totalItems: data.total_items,
        });
    }
}

// "pagination": {
//     "current_page": 1,
//     "has_previous_page": false,
//     "has_next_page": false,
//     "per_page": 10,
//     "total_items": 10,
//     "total_pages": 1
//   }


interface ConnectionBuilderInput<T>/*<T extends Node>*/ {
    buildItem?: (input: JsonInput) => T;
}

export default class Pagination<T>/*<T extends Node>*/{
   
    pageInfo: PageInfo;
    items: T[];

    constructor(data: {
        pageInfo: PageInfo;
        items: T[];
    } & ConnectionBuilderInput<T>) {
        this.pageInfo = data.pageInfo;
        this.items = data.items;
    }

    static fromJson<T extends Node>(json: JsonInput & ConnectionBuilderInput<T>): Pagination<T> {
        const pageInfo = PageInfo.fromJson(json.pagination);

        return Pagination.build({
            ...json,
            pageInfo,
        });
        // return new Connection<T>({
        //     totalCount: json.totalCount,
        //     pageInfo: PageInfo.fromJson(json.pageInfo),
        //     edges: json.edges.map((x: any) => Edge.fromJson(x)),
        // });
    }


    static build<T extends Node>({  pageInfo, items, buildItem }: {
        pageInfo: PageInfo;
        items?: T[];
    } & ConnectionBuilderInput<T>): Pagination<T> {

        const _items: T[] = [];
        let item: JsonInput | T | undefined;

        for (item of (items ?? [])) {
            if (item) {
                if (buildItem) {
                    item = buildItem(item);
                }
            }
            _items.push(item as any);
        }

        return new Pagination({
            pageInfo,
            items: _items
        });
    }

    toJson(): any {
        return {
            pageInfo: this.pageInfo.toJson(),
            edges: this.items.map((x) => String(x)),
        };
    }
}