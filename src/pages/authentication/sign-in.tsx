import React, { useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../../helpers";
import { useHistory } from "react-router-dom";
import { getCallbackUrl } from "../../utils";
import { SIGN_IN, ADD_DETAILS } from "../../constants";
import { getGoogleProfile, getRoles } from "../../apis";
import { GoogleProfile } from "../../models";

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
					.then((response: GoogleProfile) => {
						dispatch({ type: ADD_DETAILS, payload: { ...response, role: null } });

						getRoles()
							.then((responseRoles) => {
								const role = responseRoles?.values.find((role: string[]) => role[0] === response.email);
								dispatch({
									type: ADD_DETAILS,
									payload: { role: role?.length > 0 ? role[1] : "none" },
								});
							})
							.catch((error) => {
								//TODO: Notify
							});
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
