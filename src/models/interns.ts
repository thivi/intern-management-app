import { Profile } from "./profile";

export interface Intern {
	email: string;
	name: string;
	pullRequests: number;
	gitIssues: number;
	presentationsOrWebinars: number;
	blogs: number;
	projectTasksCompletion: number;
	profile: Profile;
}
