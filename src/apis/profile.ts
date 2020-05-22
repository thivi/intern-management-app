import { Methods, http } from "../configs";
import Axios, { AxiosRequestConfig } from "axios";
import { apiEndpoints } from "../constants";
import { errorStatus } from "../utils";
import { GoogleProfile, Profile } from "../models";

export const getProfile = (): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.GET,
		url: `${apiEndpoints.profile}/Intern_Profile`,
	};

	return http(config)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(errorStatus(response.status));
            }

			return Promise.resolve(response.data);
		})
		.catch((error) => {
			return Promise.reject(error?.response?.data);
		});
};

export const getGoogleProfile = (): Promise<GoogleProfile> => {
	const config: AxiosRequestConfig = {
		method: Methods.GET,
		url: apiEndpoints.googleProfile,
		headers: {
			Authorization: `Bearer ${gapi.client.getToken().access_token}`,
		},
	};

	return Axios(config)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(errorStatus(response.status));
            }

			return Promise.resolve(response.data);
		})
		.catch((error) => {
			return Promise.reject(error?.response?.data);
		});
};
