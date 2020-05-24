import React, { useEffect, useContext } from "react";
import { signOut, updateCallbackUrl } from "../../utils";
import { AuthContext } from "../../helpers";
import { useHistory } from "react-router-dom";
import { LOGIN } from "../../constants";

export const SignOut = (): React.ReactElement => {
	const { authState, dispatch } = useContext(AuthContext);

	const history = useHistory();
	useEffect(() => {
		updateCallbackUrl("/");
		signOut(dispatch);
		gapi.auth2.getAuthInstance().signOut()
		history.push(LOGIN);
	}, [history, dispatch, authState.authData]);
	return <></>;
};
