import { Profile } from "./profile";
import { GitIssue, PresentationOrWebinar, ProjectTask, PullRequest } from ".";

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

export interface InternInfo {
	profile: Profile;
	blogs: Intern[];
	gitIssues: GitIssue[];
	pullRequests: PullRequest[];
	presentationsOrWebinars: PresentationOrWebinar[];
	projectTasks: ProjectTask[];
}
