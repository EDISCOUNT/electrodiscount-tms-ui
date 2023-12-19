import axios from 'axios'
import type { App } from 'vue'

interface AxiosOptions {
    baseUrl?: string
    token?: string
}


export function createAxios(options: AxiosOptions) {

    const Authorization = options.token ? `Bearer ${options.token}` : undefined;
    const http = axios.create({
        baseURL: options.baseUrl,
        headers: {
            Authorization
        }
    });
    return http;
}

export const AxiosPlugin = {
    install: (app: App, options: AxiosOptions) => {
        const http = createAxios(options);
        app.config.globalProperties.$axios = http;
    }
}

const http = createAxios({
    baseUrl: 'http://localhost:8000',
});


export default  http;