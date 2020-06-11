import React, { ReactElement, useContext } from "react";
import { Snackbar } from "@material-ui/core";
import { NotificationContext } from "../helpers";
import { CLOSE_NOTIFICATION } from "../constants";
import { Alert } from "@material-ui/lab";

export const NotificationComponent = (): ReactElement => {
	const { notification, dispatch } = useContext(NotificationContext);

	const close = () => {
		dispatch({
			type: CLOSE_NOTIFICATION,
			payload: null,
		});
	};

	return (
		<Snackbar open={notification.open} autoHideDuration={2000} onClose={close}>
			<Alert onClose={close} severity={notification.status ?? "success"}>
				{notification.message}
			</Alert>
		</Snackbar>
	);
};
