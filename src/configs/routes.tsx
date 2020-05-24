import { RouteInterface } from "../models";
import { SignIn, Dashboard, ProfilePage, SignOut, PullRequests, GitIssues } from "../pages";
import { LOGOUT, LOGIN, HOME, PROFILE, GIT_ISSUES_PATH, PULL_REQUESTS_PATH } from "../constants";

export const routes: RouteInterface[] = [
	{
		component: SignIn,
		path: LOGIN,
		showOnMenu: false,
		protected: false,
		exact: true,
		name: "Login",
		appLayout: false,
	},
	{
		component: SignOut,
		path: LOGOUT,
		protected: true,
		exact: true,
		name: "Logout",
		showOnMenu: false,
		appLayout: false,
	},
	{
		component: Dashboard,
		path: HOME,
		showOnMenu: false,
		protected: true,
		exact: true,
		name: "Home",
		appLayout: true,
	},
	{
		component: ProfilePage,
		path: PROFILE,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Profile",
		appLayout: true,
	},
	{
		component: GitIssues,
		path: GIT_ISSUES_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Git Issues",
		appLayout: true,
	},
	{
		component: PullRequests,
		path: PULL_REQUESTS_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Pull Requests",
		appLayout: true,
	}
];
