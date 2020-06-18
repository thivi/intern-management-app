import { ADMIN, INTERN, MENTOR, ANONYMOUS, ALL } from "../constants";

export interface Role {
	Email_ID: string;
	role: RoleType[];
	id?: string;
}

export type RoleType = typeof ADMIN | typeof INTERN | typeof MENTOR | typeof ANONYMOUS;

export type Permissions = typeof ADMIN | typeof INTERN | typeof MENTOR | typeof ALL;

export type RoleAndPermission = RoleType & Permissions;
