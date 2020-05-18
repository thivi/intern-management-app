import React, { useEffect, useContext } from "react";
import { signOut, updateCallbackUrl } from "../../utils";
import { AuthContext } from "../../helpers";
import { useHistory } from "react-router-dom";
import { LOGIN } from "../../constants";

export const SignOut = (): React.ReactElement => {
	const { dispatch } = useContext(AuthContext);

	const history = useHistory();
	useEffect(() => {
		updateCallbackUrl("/");
		signOut(dispatch);
		history.push(LOGIN);
	}, [history, dispatch]);
	return <></>;
};
