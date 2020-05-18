import { AuthAction } from "../models";
import { SIGN_IN, ACCESS_TOKEN, CALLBACK_URL } from "../constants";

export const signIn = (dispatch: React.Dispatch<AuthAction>, accessToken: string) => {
	localStorage.setItem(ACCESS_TOKEN, accessToken);
	dispatch({ type: SIGN_IN, payload: accessToken });
};

export const getAccessToken = ():string => {
	return localStorage.getItem(ACCESS_TOKEN) ?? "";
};

export const updateCallbackUrl = (url: string) => {
	localStorage.setItem(CALLBACK_URL, url);
}

export const getCallbackUrl = (): string | null => {
	return localStorage.getItem(CALLBACK_URL);
}
