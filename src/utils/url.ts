export function openLink(url: string, { openInNew = false } = {}) {
    const link = document.createElement('a');
    link.href = url;
    if (openInNew) {
        link.target = '_blank';
    }
    link.click();
}


export function encodeURLParams(data: {[i:string]: any}){
    
    const params = new URLSearchParams();
    
    for (const key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach((item: any) => {
                params.append(key, item);
            });
        } else {
            params.append(key, data[key]);
        }
    }

    const queryString = params.toString();
    return queryString;
}