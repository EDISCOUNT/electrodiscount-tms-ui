export default class ShipmentSource {
    title: string;
    subtitle: string;
    description: string;
    code: string;
    id: string;
    iconImage: string;

    constructor({
        title,
        subtitle,
        description,
        code,
        id,
        iconImage,
    }: {
        title: string;
        subtitle: string;
        description: string;
        code: string;
        id: string;
        iconImage: string;
    }) {
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.code = code;
        this.id = id;
        this.iconImage = iconImage;
    }

    static fromJson(json: Record<string, any>): ShipmentSource {
        return new ShipmentSource({
            title: json["title"],
            subtitle: json["subtitle"],
            description: json["description"],
            code: json["code"],
            id: json["id"],
            iconImage: json["iconImage"],
        });
    }

    toJson(): Record<string, any> {
        return {
            "title": this.title,
            "subtitle": this.subtitle,
            "description": this.description,
            "code": this.code,
            "id": this.id,
            "iconImage": this.iconImage,
        };
    }
}
