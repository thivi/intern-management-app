import { ROLES_PATH, NOT_FOUND, DASHBOARD } from "../constants";

export const findHome = (role: string): string => {
	switch (role) {
		case "mentor":
			return DASHBOARD;
		case "intern":
			return DASHBOARD;
		case "admin":
			return ROLES_PATH;
		default:
			return NOT_FOUND;
	}
};
