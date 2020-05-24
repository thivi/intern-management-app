import { Methods, http } from "../configs";
import { AxiosRequestConfig } from "axios";
import { apiEndpoints, BLOGS } from "../constants";
import { errorStatus } from "../utils";

export const getBlogs = (): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.GET,
		url: `${apiEndpoints.sheet}/${BLOGS}`,
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

export const updateBlogs = (range: string, values: string[]): Promise<any> => {
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

export const addBlogs = (values: string[]): Promise<any> => {
	const config: AxiosRequestConfig = {
		method: Methods.POST,
		url: `${apiEndpoints.sheet}/${BLOGS}:append`,
		data: {
			range: BLOGS,
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

export const deleteBlog = (range: string): Promise<any> => {
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
