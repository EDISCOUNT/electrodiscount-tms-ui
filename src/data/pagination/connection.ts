import Edge from "./edge";
import PageInfo from "./page_info";
import { Node } from "./types";


type JsonInput = { [i: string]: any };

interface EdgeJsonInput {
    node?: JsonInput;
    cursor?: String,
}

interface ConnectionBuilderInput<T extends Node> {
    buildNode?: (input: JsonInput) => T;
    buildEdge?: (input: JsonInput) => Edge<T>;
}

export default class Connection<T extends Node>{
    totalCount: number;
    pageInfo: PageInfo;
    edges: Edge<T>[];

    constructor(data: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: Edge<T>[];
    } & ConnectionBuilderInput<T>) {
        this.totalCount = data.totalCount;
        this.pageInfo = data.pageInfo;
        this.edges = data.edges;
    }

    static fromJson<T extends Node>(json: JsonInput & ConnectionBuilderInput<T>): Connection<T> {
        const totalCount = json.totalCount;
        const pageInfo = PageInfo.fromJson(json.pageInfo);

        return Connection.build({
            ...json,
            totalCount,
            pageInfo,
        });
        // return new Connection<T>({
        //     totalCount: json.totalCount,
        //     pageInfo: PageInfo.fromJson(json.pageInfo),
        //     edges: json.edges.map((x: any) => Edge.fromJson(x)),
        // });
    }


    static build<T extends Node>({ totalCount, pageInfo, edges, buildEdge, buildNode }: {
        totalCount: number;
        pageInfo: PageInfo;
        edges?: EdgeJsonInput[];
    } & ConnectionBuilderInput<T>): Connection<T> {

        const _edges: Edge<T>[] = [];

        let node: JsonInput | T | undefined;
        let cursor: String | undefined;
        let props: JsonInput;
        let edge: Edge<T>;

        for ({ node, cursor, ...props } of (edges ?? [])) {
            if (node) {
                if (buildNode) {
                    node = buildNode(node);
                }
            }

            if (buildEdge) {
                edge = buildEdge({ node, cursor, ...props });
            } else {
                edge = Edge.fromJson<T>({
                    node, cursor, ...props
                });
            }
            _edges.push(edge);
        }

        return new Connection({
            totalCount,
            pageInfo,
            edges: _edges
        });
    }

    toJson(): any {
        return {
            totalCount: this.totalCount,
            pageInfo: this.pageInfo.toJson(),
            edges: this.edges.map((x) => x.toJson()),
        };
    }
}