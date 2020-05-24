import { Methods, http } from "../configs";
import { AxiosRequestConfig } from "axios";
import { apiEndpoints, GIT_ISSUES } from "../constants";
import { errorStatus } from "../utils";

export const getIssues = (): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.GET,
		url: `${apiEndpoints.sheet}/${GIT_ISSUES}`,
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

export const updateIssues = (range: string, values: string[]): Promise<any> => {
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
			return Promise.reject(error?.response?.data);
		});
};

export const addIssues = (values: string[]): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.POST,
		url: `${apiEndpoints.sheet}/${GIT_ISSUES}:append`,
		data: {
			range: GIT_ISSUES,
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

export const deleteIssue = (range: string): Promise<any> => {
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
			return Promise.reject(error?.response?.data);
		});
};
