import { Methods, http } from "../configs";
import { AxiosRequestConfig } from "axios";
import { apiEndpoints, PRESENTATIONS_OR_WEBINARS } from "../constants";
import { errorStatus } from "../utils";

export const getPresentationsOrWebinars = (): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.GET,
		url: `${apiEndpoints.sheet}/${PRESENTATIONS_OR_WEBINARS}`,
	};

	return http(config)
		.then((response) => {
			if (response.status !== 200) {
				return Promise.reject(errorStatus(response.status));
			}

			return Promise.resolve(response.data);
		})
		.catch((error) => {
			return Promise.reject(error?.response?.data?.error?.message);
		});
};

export const updatePresentationsOrWebinars = (range: string, values: string[]): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.PUT,
		url: `${apiEndpoints.sheet}/${range}`,
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
			return Promise.reject(error?.response?.data?.error?.message);
		});
};

export const addPresentationsOrWebinars = (values: string[]): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.POST,
		url: `${apiEndpoints.sheet}/${PRESENTATIONS_OR_WEBINARS}:append`,
		data: {
			range: PRESENTATIONS_OR_WEBINARS,
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
			return Promise.reject(error?.response?.data?.error?.message);
		});
};

export const deletePresentationOrWebinar = (range: string): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.POST,
		url: `${apiEndpoints.sheet}/${range}:clear`
	};

	return http(config)
		.then((response) => {
			if (response.status !== 200) {
				return Promise.reject(errorStatus(response.status));
			}

			return Promise.resolve(response.data);
		})
		.catch((error) => {
			return Promise.reject(error?.response?.data?.error?.message);
		});
};
