import React, { useContext, useEffect, useCallback, useState } from "react";
import { AuthContext, NotificationContext } from "../../helpers";
import { useHistory } from "react-router-dom";
import { getCallbackUrl, Notify } from "../../utils";
import { SIGN_IN, ADD_DETAILS, ANONYMOUS } from "../../constants";
import { getGoogleProfile, getRoles } from "../../apis";
import { GoogleProfile, NotificationType } from "../../models";
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Slide, LinearProgress } from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
import useStyles from "../../theme";
import { LoginGraphic } from "../../theme/img";

export const SignIn = (): React.ReactElement => {
	const { dispatch } = useContext(AuthContext);
	const { dispatch: dispatchNotification } = useContext(NotificationContext);

	const history = useHistory();

	const [showTip, setShowTip] = useState(false);

	const classes = useStyles();

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
									payload: { role: role?.length > 0 ? role[1].split(" ") : [ANONYMOUS] }
								});
							})
							.catch((error) => {
								dispatchNotification(
									Notify({
										status: NotificationType.ERROR,
										message: error
									})
								);
							})
							.finally(() => {
								history?.push(getCallbackUrl() ?? "");
							});
					})
					.catch((error) => {
						dispatchNotification(
							Notify({
								status: NotificationType.ERROR,
								message: error
							})
						);
					});
			} else {
				GoogleAuth.signIn();
			}
		},
		[dispatch, history, dispatchNotification]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowTip(true);
		}, 5000);

		return () => {
			clearTimeout(timer);
		};
	}, []);

 	useEffect(() => {
		gapi.load("client:auth2", () => {
			gapi.client
				.init({
					clientId: process.env.REACT_APP_CLIENT_ID,
					scope:
						"https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile",
					discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
				})
				.then(() => {
					let GoogleAuth = gapi.auth2.getAuthInstance();
					signIn(GoogleAuth);
					GoogleAuth.isSignedIn.listen(() => {
						signIn(GoogleAuth);
					});
				}).catch(error => {
					dispatchNotification(
						Notify({
							status: NotificationType.ERROR,
							message: error?.response?.data
						})
					);
				});
		});
	}, [signIn, dispatchNotification]);

	return (
		<Box
			width="100%"
			minHeight="100vh"
			display="flex"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			className={classes.coloredBackground}
		>
			<Box marginBottom={4}>
				<img src={LoginGraphic} alt="login" width="400px" />
			</Box>
			<Typography variant="h4" align="center" className={classes.primaryTextOnColoredBackground}>
				<Box width="100%" marginBottom={4}>
					<LinearProgress color="secondary" />
				</Box>
				Hold on! You are being logged in...
			</Typography>

			<Slide direction="up" in={showTip}>
				<Box marginTop={4}>
					<Typography
						variant="h5"
						color="textSecondary"
						align="center"
						className={classes.secondaryTextOnColoredBackground}
					>
						Have trouble logging in?
					</Typography>
					<Box marginTop={4}>
						<Typography
							variant="h6"
							color="textSecondary"
							align="center"
							className={classes.secondaryTextOnColoredBackground}
						>
							Please make sure
							<List>
								<ListItem>
									<ListItemIcon>
										<CheckCircleOutline className={classes.secondaryTextOnColoredBackground} />
									</ListItemIcon>
									<ListItemText className={classes.secondaryTextOnColoredBackground}>
										You have enabled cookies for this site
									</ListItemText>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<CheckCircleOutline className={classes.secondaryTextOnColoredBackground} />
									</ListItemIcon>
									<ListItemText className={classes.secondaryTextOnColoredBackground}>
										You have enabled pop-ups for this site
									</ListItemText>
								</ListItem>
							</List>
						</Typography>
					</Box>
				</Box>
			</Slide>
		</Box>
	);
};
