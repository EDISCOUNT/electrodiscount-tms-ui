import { BASE_URL } from '@/common/constants'
import { useConfigStore } from '@/store/app'
import axios, { AxiosInstance } from 'axios'
import type { App } from 'vue'

interface AxiosOptions {
    baseUrl?: string
    token?: string
}


// let http!: AxiosInstance;


export function createAxios(options: AxiosOptions = {}) {


    const baseURL = options.baseUrl ?? 'http://localhost:8000';

    const Authorization = options.token ? `Bearer ${options.token}` : undefined;
    const instance = axios.create({
        baseURL: options.baseUrl,
        headers: {
            Authorization
        }
    });
    return  instance;
}

export const AxiosPlugin = {
    install: (app: App, options: AxiosOptions) => {
        const http = createAxios(options);
        app.config.globalProperties.$axios = http;
    }
}

const http = createAxios({
    // baseUrl: 'http://localhost:8000',
    baseUrl: BASE_URL
});


export default  http;