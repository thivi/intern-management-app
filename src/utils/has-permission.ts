import { Permissions, RoleType, RoleAndPermission } from "../models";
import { ALL } from "../constants";

export const hasPermission = (permissions: Permissions | Permissions[], role: RoleType[]): boolean => {
	if (permissions === ALL) {
		return true;
	}
	if (typeof permissions === "string") {
		return role.includes(permissions);
	}

	if (permissions instanceof Array) {
		let isPermitted = false;

		if (permissions.includes(ALL)) {
			return true;
		}

		for (const permission of permissions) {
			if (role.includes(permission as RoleAndPermission)) {
				isPermitted = true;
				break;
			}
		}

		return isPermitted;
	}
};
