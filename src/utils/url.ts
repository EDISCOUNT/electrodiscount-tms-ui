import { de } from "date-fns/locale";

export function openLink(url: string, { openInNew = false } = {}) {
    const link = document.createElement('a');
    link.href = url;
    if (openInNew) {
        link.target = '_blank';
    }
    link.click();
}


export function encodeURLParams(data: { [i: string]: any }) {

    const params = new URLSearchParams();

    for (const key in data) {
        if (Array.isArray(data[key])) {
            (data[key] as string[]).forEach((item: any, index) => {
                if (item === undefined || item === null || item === '') {
                    return;
                }
                params.append(`${key}[]`, item);
            });
            // const entries = data[key].filter((item: any) => !(item === undefined || item === null || item === ''));
            // params.append(key,entries);
        } else {
            const item = data[key];
            if (item === undefined || item === null || item === '') {
                continue;
            }
            params.append(key, item);
        }
    }

    const queryString = params.toString();
    return queryString;
}


export function deepEncodeURLParams(data: any, prefix = ''): string {
    const params = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            let value = data[key];
            let finalKey = prefix ? `${prefix}[${key}]` : key;

            if ((value !== null) && (typeof value == 'object' && value.constructor === Object)) {
                const deepParams = deepEncodeURLParams(value, finalKey);
                console.log({ deepParams, value })
                if (deepParams) {
                    params.push(deepParams);
                }
            } else {
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        continue;
                    }
                    value = value
                        .filter(item => !(item === undefined || item === null || item === ''))
                        // .map(e => normalizeValue(e))
                        ;
                    // finalKey += '[]';

                    const deepParams = deepEncodeURLParams(value, finalKey);
                    console.log("ARRAY: ", { deepParams, value })
                    if (deepParams) {
                        params.push(deepParams);
                    }
                    continue;

                    // for (const item of value) {

                    // }

                    // value.forEach((item: any, index) => {

                    // });
                } else if (value === undefined || value === null || value === '') {
                    continue;
                }
                value = normalizeValue(value);
                params.push(encodeURIComponent(finalKey) + '=' + encodeURIComponent(value));
            }
        }
    }

    return params.join('&');
}



export function normalizeValue(input: any) {
    if (input instanceof Date) {
        return input.toISOString();
    }
    if (Array.isArray(input)) {
        input = input.map(e => normalizeValue(e));
    }
    return input?.toString();
}