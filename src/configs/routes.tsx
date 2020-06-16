import { RouteInterface } from "../models";
import {
	SignIn,
	Dashboard,
	ProfilePage,
	SignOut,
	PullRequests,
	GitIssues,
	PresentationsOrWebinars,
	Blogs,
	Projects,
	ProjectTasks,
	NotFound,
	Interns,
	Roles,
	Home
} from "../pages";
import {
	LOGOUT,
	LOGIN,
	PROFILE,
	GIT_ISSUES_PATH,
	PULL_REQUESTS_PATH,
	PRESENTATIONS_OR_WEBINARS_PATH,
	BLOGS_PATH,
	PROJECTS_PATH,
	PROJECT_TASKS_PATH,
	NOT_FOUND,
	INTERNS,
	ROLES_PATH,
	DASHBOARD,
	HOME,
	MENTOR,
	INTERN,
	ALL,
	ADMIN
} from "../constants";
import {
	AccountCircleOutlined,
	ErrorOutline,
	SlideshowOutlined,
	DashboardOutlined,
	PlaylistAddCheckOutlined,
	CreateOutlined,
	WorkOutlineOutlined,
	LowPriorityOutlined,
	PeopleOutlineOutlined,
	AssignmentIndOutlined
} from "@material-ui/icons";
import React from "react";

export const routes: RouteInterface[] = [
	{
		component: Dashboard,
		path: DASHBOARD,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Dashboard",
		appLayout: true,
		permission: [MENTOR, INTERN],
		icon: <DashboardOutlined />
	},
	{
		component: SignIn,
		path: LOGIN,
		showOnMenu: false,
		protected: false,
		exact: true,
		name: "Login",
		appLayout: false,
		permission: ALL
	},
	{
		component: SignOut,
		path: LOGOUT,
		protected: true,
		exact: true,
		name: "Logout",
		showOnMenu: false,
		appLayout: false,
		permission: ALL
	},
	{
		component: ProfilePage,
		path: PROFILE,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Profile",
		appLayout: true,
		permission: INTERN,
		icon: <AccountCircleOutlined />
	},
	{
		component: GitIssues,
		path: GIT_ISSUES_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Git Issues",
		appLayout: true,
		permission: INTERN,
		icon: <ErrorOutline />
	},
	{
		component: PullRequests,
		path: PULL_REQUESTS_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Pull Requests",
		appLayout: true,
		permission: INTERN,
		icon: <LowPriorityOutlined />
	},
	{
		component: PresentationsOrWebinars,
		path: PRESENTATIONS_OR_WEBINARS_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Presentations/Webinars",
		appLayout: true,
		permission: INTERN,
		icon: <SlideshowOutlined />
	},
	{
		component: Blogs,
		path: BLOGS_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Blogs",
		appLayout: true,
		permission: INTERN,
		icon: <CreateOutlined />
	},
	{
		component: Projects,
		path: PROJECTS_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Projects",
		appLayout: true,
		permission: INTERN,
		icon: <WorkOutlineOutlined />
	},
	{
		component: ProjectTasks,
		path: PROJECT_TASKS_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Project Tasks",
		appLayout: true,
		permission: INTERN,
		icon: <PlaylistAddCheckOutlined />
	},
	{
		component: NotFound,
		path: NOT_FOUND,
		showOnMenu: false,
		protected: true,
		exact: false,
		name: "Not Found",
		appLayout: true,
		permission: ALL
	},
	{
		component: Interns,
		path: INTERNS,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Interns",
		appLayout: true,
		permission: ALL,
		icon: <PeopleOutlineOutlined />
	},
	{
		component: Roles,
		path: ROLES_PATH,
		showOnMenu: true,
		protected: true,
		exact: false,
		name: "Roles",
		appLayout: true,
		permission: ADMIN,
		icon: <AssignmentIndOutlined />
	},
	{
		component: Home,
		path: HOME,
		showOnMenu: false,
		protected: true,
		exact: false,
		name: "Home",
		appLayout: true,
		permission: ALL
	}
];
