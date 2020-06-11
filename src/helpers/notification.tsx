import React, { ReactElement, useReducer } from "react";
import { NotificationContext, initialStateNotification } from "./notification-context";
import { NotificationInterface, NotificationActionInterface } from "../models";
import { SEND_NOTIFICATION, CLOSE_NOTIFICATION } from "../constants";

const reducer = (state: NotificationInterface, action: NotificationActionInterface) => {
	switch (action.type) {
		case SEND_NOTIFICATION:
			return { ...action.payload, open: true };
		case CLOSE_NOTIFICATION:
			return { message: state.message, status: state.status, open: false };
		default:
			return { ...state };
	}
};

export const Notification = (props: React.PropsWithChildren<any>): ReactElement => {
	const [notificationState, dispatch] = useReducer(reducer, initialStateNotification);

	const { children } = props;
	return (
		<NotificationContext.Provider value={{ notification: notificationState, dispatch: dispatch }}>
			{children}
		</NotificationContext.Provider>
	);
};
