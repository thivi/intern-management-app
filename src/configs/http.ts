import { getAccessToken } from "./../utils/sign-in";
import axios, { AxiosRequestConfig } from "axios";

export enum Methods {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PATCH = "PATCH",
    PUT = "PUT"
}

const config: AxiosRequestConfig = {
    baseURL: "https://sheets.googleapis.com/v4/spreadsheets/"
};

const httpClient = axios.create({
    ...config
});

httpClient.interceptors.request.use(
    (config) => {
        if (getAccessToken()) {
            config.headers = {
                Authorization: `Bearer ${getAccessToken()}`
            };
        }
        config.url=`${config.url}?key=${process.env.REACT_APP_API_KEY}`
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const http = httpClient;
