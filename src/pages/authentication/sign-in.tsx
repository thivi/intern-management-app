import React, { useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../../helpers";
import { useHistory } from "react-router-dom";
import { getCallbackUrl } from "../../utils";
import { SIGN_IN, ADD_DETAILS } from "../../constants";
import { getGoogleProfile } from "../../apis";

export const SignIn = (): React.ReactElement => {
	const { dispatch } = useContext(AuthContext);

	const history = useHistory();

	const signIn = useCallback(
		(GoogleAuth: gapi.auth2.GoogleAuth) => {
			let user = GoogleAuth.currentUser.get();
			if (
				user.hasGrantedScopes(
					"https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile"
				)
			) {
				dispatch({ type: SIGN_IN, payload: null });
				
				getGoogleProfile()
					.then((response) => {
						dispatch({ type: ADD_DETAILS, payload: response });
					})
					.catch((error) => {
						//TODO: Notify
					});

				history?.push(getCallbackUrl() ?? "");
			} else {
				GoogleAuth.signIn();
			}
		},
		[dispatch, history]
	);

	useEffect(() => {
		gapi.load("client:auth2", () => {
			gapi.client
				.init({
					clientId: process.env.REACT_APP_CLIENT_ID,
					scope:
						"https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile",
					discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
				})
				.then(() => {
					let GoogleAuth = gapi.auth2.getAuthInstance();
					signIn(GoogleAuth);
					GoogleAuth.isSignedIn.listen(() => {
						signIn(GoogleAuth);
					});
				});
		});
	}, [signIn]);

	return null;
};
