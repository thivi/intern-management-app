import { AuthAction } from "../models";
import { SIGN_OUT, ACCESS_TOKEN } from "../constants";

export const signOut = (dispatch: React.Dispatch<AuthAction>) => {
	localStorage.removeItem(ACCESS_TOKEN);
	dispatch({ type: SIGN_OUT, payload: null });
};
