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
            data[key].forEach((item: any) => {
                if (item === undefined || item === null || item === '') {
                    return;
                }
                params.append(key, item);
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