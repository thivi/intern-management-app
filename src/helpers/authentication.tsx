import React, { useEffect, useReducer } from "react";
import { AuthContext } from "./auth-context";
import { AuthState, AuthAction } from "../models";
import { SIGN_IN, SIGN_OUT, ADD_DETAILS } from "../constants";
import { getAccessToken } from "../utils";

const reducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case SIGN_IN:
			return { ...state, authenticated: true, accessToken: action.payload };
		case SIGN_OUT:
			return { ...state, authenticated: false, accessToken: null, isAdmin: 0 };
		case ADD_DETAILS:
			return { ...state, staffDetails: action.payload, isAdmin: action.payload ? 2 : 1 };
		default:
			return { ...state };
	}
};

const initialState: AuthState = { authenticated: false, accessToken: null, staffDetails: null, isAdmin: 0 };
export const Authentication = (props: React.PropsWithChildren<any>): React.ReactElement => {
	const [ authState, dispatch ] = useReducer(reducer, initialState);
	const { children } = props;

	useEffect(() => {
		// Check if access token is there in the local storage
		if (getAccessToken()) {
			dispatch({ type: SIGN_IN, payload: getAccessToken() });
		}
	}, []);

	return <AuthContext.Provider value={ { authState, dispatch } }>{ children }</AuthContext.Provider>;
};
