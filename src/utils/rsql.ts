import { Operation } from "rsql-builder";
import { Operators } from "rsql-builder";
import { Argument } from "rsql-builder/dist/cjs/operation";
import { inList, outList } from "rsql-builder";

type DateTimeInput = Date | string;

export function like(value: any): Operation {
    return new Operation(value, "=like=");
}
export function ilike(value: any): Operation {
    return new Operation(value, "=ilike=");
}

export function sameday(value: DateTimeInput): Operation {
    return new Operation(nomalizeDateTimeInput(value), "=sameday=");
}

export function sameweek(value: DateTimeInput): Operation {
    return new Operation(nomalizeDateTimeInput(value), "=sameweek=");
}

export function samemonth(value: DateTimeInput): Operation {
    return new Operation(nomalizeDateTimeInput(value), "=samemonth=");
}

export function between(a: any, b: any): Operation {

    return new ArrayOperation([a, b], "=between=");
    // return new Operation(`, "=between=");
}



class ArrayOperation extends Operation {
    constructor(private _args: Argument[], private _operator?: Operators | string) {
        super(false, _operator);
    }
    toString(): string {
        // // return this
        // const str = super.toString();
        // console.log('Data: ', str);
        const operands = `(${this._args.join(',')})`;
        const str = `${this._operator}${operands}`;

        console.log('Data: ', str);
        return str;
    }
}


function nomalizeDateTimeInput(input: DateTimeInput){
    if(input instanceof Date){
        const date = input;

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
      
        const datestring =  `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
        // console.log("DATE STRING: ", {datestring});
        return datestring;
        // return input.toISOString();
        // return String(input);
    }
    return input;
}