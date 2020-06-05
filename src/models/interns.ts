import { Profile } from "./profile";
import { GitIssue, PresentationOrWebinar, ProjectTask, PullRequest, Project } from ".";
import { Blog } from "./blogs";

export interface Intern {
	email: string;
	name: string;
	pullRequests: number;
	gitIssues: number;
	presentationsOrWebinars: number;
	blogs: number;
	projectTasksCompletion: number;
	profile: Profile;
	projects: Project[];
}

export interface InternInfo {
	profile: Profile;
	blogs: Blog[];
	gitIssues: GitIssue[];
	pullRequests: PullRequest[];
	presentationsOrWebinars: PresentationOrWebinar[];
	projectTasks: ProjectTask[];
	projects: Project[];
}
