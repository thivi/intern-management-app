import { SIGN_IN, ADD_DETAILS, SIGN_OUT } from "./../constants/authentication";
import { GoogleProfile } from "./profile";

export interface AuthState {
	authenticated: boolean;
    accessToken: string | null;
    authData: GoogleProfile;
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
    payload: GoogleProfile;
}
export type AuthAction = AddDetails | SignIn | SignOut;

export interface AuthContextInterface {
    authState: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}
