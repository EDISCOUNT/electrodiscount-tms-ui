import { Node } from "./types";

export default class Edge<T extends Node> {
    cursor: string;
    node: T;

    constructor(data: {
        cursor: string;
        node: T;
    }) {
        this.cursor = data.cursor;
        this.node = data.node;
    }

    static fromJson<T extends Node>(json: any): Edge<T> {
        return new Edge({
            cursor: json.cursor,
            node: json.node,
        });
    }

    toJson(): any {
        return {
            cursor: this.cursor,
            node: this.node.toJson(),
        };
    }
}