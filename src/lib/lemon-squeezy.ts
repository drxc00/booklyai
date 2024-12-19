import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Base interface for LemonSqueezy API responses
export interface LemonSqueezyResponse<T = object> {
    data: {
        type: string;
        id: number;
        attributes: {
            url: string;
            checkout_data: {
                email: string;
                custom: {
                    bookId: string;
                    userId: string;
                    email: string;
                };
            };
            expires_at: string;
        };
        relationships?: object;
        links?: object;
        meta?: object;
        included?: object[];
    }
}

// Base URL of LemonSqueezy API
const LEMON_SQUEEZY_BASE_URL = "https://api.lemonsqueezy.com/v1/";

// Default headers for every request
const REQUEST_HEADERS = {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
};

// Create a generic Axios instance
const lemonSqueezy: AxiosInstance = axios.create({
    baseURL: LEMON_SQUEEZY_BASE_URL,
    headers: REQUEST_HEADERS,
});

// A utility function for type-safe requests
export const lemonSqueezyRequest = async <T,>(
    config: AxiosRequestConfig
): Promise<LemonSqueezyResponse<T>> => {
    const response = await lemonSqueezy.request<LemonSqueezyResponse<T>>(config);
    return response.data;
};