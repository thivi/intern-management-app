import { NotificationState, NotificationActionInterface } from "../models";
import { SEND_NOTIFICATION } from "../constants";

export const Notify = (state: NotificationState): NotificationActionInterface => ({
	payload: { ...state },
	type: SEND_NOTIFICATION,
});
