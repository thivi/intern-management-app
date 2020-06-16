import { SIGN_IN, ADD_DETAILS, SIGN_OUT } from "./../constants/authentication";
import { GoogleProfile } from "./profile";
import { RoleType } from ".";

interface AuthData extends GoogleProfile {
	role: RoleType[];
}

export interface AuthState {
	authenticated: boolean;
	accessToken: string | null;
	authData: AuthData;
}

export interface SignIn {
	type: typeof SIGN_IN;
	payload: string;
}

export interface SignOut {
	type: typeof SIGN_OUT;
	payload: null;
}

export interface AddDetails {
	type: typeof ADD_DETAILS;
	payload: GoogleProfile | { role: RoleType[] };
}

export type AuthAction = AddDetails | SignIn | SignOut;

export interface AuthContextInterface {
	authState: AuthState;
	dispatch: React.Dispatch<AuthAction>;
}
