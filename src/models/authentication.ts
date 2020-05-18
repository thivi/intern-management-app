import { SIGN_IN, ADD_DETAILS, SIGN_OUT } from "./../constants/authentication";
import { StaffDetails } from ".";

export interface AuthState {
	authenticated: boolean;
	/**
	 * 0 - null
	 * 1 - Admin
	 * 2 - Staff
	 */
    isAdmin: 0 | 1 | 2;
    accessToken: string | null;
    staffDetails: StaffDetails | null;
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
    payload: StaffDetails;
}
export type AuthAction = AddDetails | SignIn | SignOut;

export interface AuthContextInterface {
    authState: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}
