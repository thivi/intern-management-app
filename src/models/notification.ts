import { SEND_NOTIFICATION, CLOSE_NOTIFICATION } from "../constants";

export interface NotificationInterface extends NotificationState {
	open: boolean;
}

export interface NotificationState {
	message: string;
	status: NotificationType;
}

export interface NotificationContextInterface {
	notification: NotificationInterface;
	dispatch: React.Dispatch<NotificationActionInterface>;
}

export interface NotificationActionInterface {
	type: typeof SEND_NOTIFICATION | typeof CLOSE_NOTIFICATION;
	payload: NotificationState;
}
export enum NotificationType {
	ERROR = "error",
	WARNING = "warning",
	SUCCESS = "success",
	INFO = "info",
}
