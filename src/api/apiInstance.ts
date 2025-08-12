import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

interface Response<T> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp?: string;
    error?: string;
}

const apiInstance: AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

if (typeof window !== "undefined") {
    apiInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem("token");
            if (token && config.headers) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
}

const api = {
    get: (url: string, config?: AxiosRequestConfig) => apiInstance.get(url, config).then(response => {
        let data: Response<any> = response.data;
        if (data.success === true) {
            return data.data;
        }
        return Promise.reject(data.message);
    }).catch(error => {
        return Promise.reject(error);
    }),
    post: (url: string, data?: any, config?: AxiosRequestConfig) => apiInstance.post(url, data, config).then(response => {
        let data: Response<any> = response.data;
        if (data.success === true) {
            return data.data;
        }
        return Promise.reject(data.message);
    }).catch(error => {
        return Promise.reject(error);
    }),
    put: (url: string, data?: any, config?: AxiosRequestConfig) => apiInstance.put(url, data, config).then(response => {
        let data: Response<any> = response.data;
        if (data.success === true) {
            return data.data;
        }
        return Promise.reject(data.message);
    }).catch(error => {
        return Promise.reject(error);
    }),
    delete: (url: string, config?: AxiosRequestConfig) => apiInstance.delete(url, config).then(response => {
        let data: Response<any> = response.data;
        if (data.success === true) {
            return data.data;
        }
        return Promise.reject(data.message);
    }).catch(error => {
        return Promise.reject(error);
    }),
};

export default api; 