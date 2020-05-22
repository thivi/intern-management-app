import React, { useReducer } from "react";
import { AuthContext } from "./auth-context";
import { AuthState, AuthAction } from "../models";
import { SIGN_IN, SIGN_OUT, ADD_DETAILS } from "../constants";

const reducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case SIGN_IN:
			return { ...state, authenticated: true, accessToken: action.payload };
		case SIGN_OUT:
			return { ...state, authenticated: false, accessToken: null };
		case ADD_DETAILS:
			return { ...state, authData: action.payload };
		default:
			return { ...state };
	}
};

const initialState: AuthState = { authenticated: false, accessToken: null, authData: null };
export const Authentication = (props: React.PropsWithChildren<any>): React.ReactElement => {
	const [authState, dispatch] = useReducer(reducer, initialState);
	const { children } = props;

	return <AuthContext.Provider value={{ authState, dispatch }}>{children}</AuthContext.Provider>;
};
