import { Methods, http } from "../configs";
import Axios, { AxiosRequestConfig } from "axios";
import { apiEndpoints } from "../constants";
import { errorStatus } from "../utils";
import { GoogleProfile } from "../models";

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

export const updateProfile = (range: string, values: string[]): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.PUT,
		url: `${apiEndpoints.profile}/${range}`,
		data: {
			range,
			majorDimension: "ROWS",
			values: [values],
		},
		params: {
			valueInputOption: "USER_ENTERED",
		},
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

export const addProfile = (values: string[]): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.POST,
		url: `${apiEndpoints.profile}/Intern_Profile:append`,
		data: {
			range:"Intern_Profile",
			majorDimension: "ROWS",
			values: [values],
		},
		params: {
			valueInputOption: "USER_ENTERED",
		},
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
