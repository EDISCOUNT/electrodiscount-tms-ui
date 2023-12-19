export default class Route {
    id: string;
    code: string;
    startPoint: string;
    endPoint: string;
    distance: number;
    duration: number;
    polyline?: string;

    constructor(
        {
            id, code, startPoint, endPoint, distance, duration, polyline
        }:
            {
                id: string,
                code: string,
                startPoint: string,
                endPoint: string,
                distance: number,
                duration: number,
                polyline: string
            }
    ) {
        this.id = id;
        this.code = code;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.distance = distance;
        this.duration = duration;
        this.polyline = polyline;
    }

    static fromJson(json: any): Route {
        return new Route({
            id: json["id"],
            code: json["code"],
            startPoint: json["startPoint"],
            endPoint: json["endPoint"],
            distance: json["distance"],
            duration: json["duration"],
            polyline: json["polyline"]
        }
        );
    }

    toJson(): any {
        return {
            "id": this.id,
            "code": this.code,
            "startPoint": this.startPoint,
            "endPoint": this.endPoint,
            "distance": this.distance,
            "duration": this.duration,
            "polyline": this.polyline,
        };
    }
}

function routeFromJson(jsonString: string): Route {
    const jsonObject = JSON.parse(jsonString);
    return Route.fromJson(jsonObject);
}

function routeToJson(data: Route): string {
    return JSON.stringify(data.toJson());
}
