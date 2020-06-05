export interface Role {
	Email_ID: string;
	role: RoleType;
	id?: string;
}

export type RoleType = "admin" | "intern" | "mentor" | "none";

export type Permissions = "admin" | "intern" | "mentor" | "all" | "none";
