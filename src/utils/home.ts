import { ROLES_PATH, NOT_FOUND, DASHBOARD, MENTOR, INTERN, ADMIN } from "../constants";
import { RoleType } from "../models";
import { routes } from "../configs";
import { hasPermission } from "./has-permission";

export const findHome = (role: RoleType[]): string => {
	switch (true) {
		case role.includes(MENTOR):
			return DASHBOARD;
		case role.includes(INTERN):
			return DASHBOARD;
		case role.includes(ADMIN):
			return ROLES_PATH;
		default:
			for (const route of routes) {
				if (route.showOnMenu && route.appLayout && hasPermission(route.permission, role)) {
					return route.path;
				}
			}
			return NOT_FOUND;
	}
};
