import { ROLES_PATH, NOT_FOUND, DASHBOARD, MENTOR, INTERN, ADMIN } from "../constants";
import { RoleType } from "../models";

export const findHome = (role: RoleType[]): string => {
	switch (true) {
		case role.includes(MENTOR):
			return DASHBOARD;
		case role.includes(INTERN):
			return DASHBOARD;
		case role.includes(ADMIN):
			return ROLES_PATH;
		default:
			return NOT_FOUND;
	}
};
