import { AuthAction } from "../models";
import { SIGN_IN, CALLBACK_URL } from "../constants";

export const signIn = (dispatch: React.Dispatch<AuthAction>, accessToken: string) => {
	dispatch({ type: SIGN_IN, payload: accessToken });
};

export const getAccessToken = ():string => {
	return gapi.client.getToken().access_token;
};

export const updateCallbackUrl = (url: string) => {
	localStorage.setItem(CALLBACK_URL, url);
}

export const getCallbackUrl = (): string | null => {
	return localStorage.getItem(CALLBACK_URL);
}
