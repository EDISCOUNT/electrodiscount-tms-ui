
export default class ReviewSummary {
    rating: number;
    count: number;


    constructor(
        { rating, count }:
            {
                rating: number,
                count: number,
            }
    ) {
        this.rating = rating;
        this.count = count;
    }

    static fromJson(json: any): ReviewSummary {
        return new ReviewSummary(
            {
                rating: json["rating"],
                count: json["count"],
            }
        );
    }

    toJson(): any {
        return {
            "rating": this.rating,
            "count": this.count,
        };
    }
}
