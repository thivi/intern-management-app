import React from "react";
import { NotificationInterface, NotificationContextInterface } from "../models";

export const initialStateNotification: NotificationInterface = {
	message: null,
	status: null,
	open: false,
};

export const NotificationContext = React.createContext<NotificationContextInterface>({
	notification: initialStateNotification,
	dispatch: null,
});
