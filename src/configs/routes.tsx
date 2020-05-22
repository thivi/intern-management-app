import { RouteInterface } from "../models";
import { SignIn, Dashboard, ProfilePage, SignOut } from "../pages";
import { LOGOUT, LOGIN, HOME, PROFILE } from "../constants";

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
];
