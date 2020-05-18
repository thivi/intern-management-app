import { RouteInterface } from "../models";
import { SignIn } from "../pages/authentication";
import { Dashboard } from "../pages/dashboard";
import { SignOut } from "../pages/authentication/sign-out";
import { LOGOUT, LOGIN, HOME} from "../constants";

export const routes: RouteInterface[] = [
	{
		component: SignIn,
		path: LOGIN,
		showOnMenu: false,
		protected: false,
		exact: true,
		name: "Login",
		appLayout: false
	},
	{
		component: SignOut,
		path: LOGOUT,
		protected: true,
		exact: true,
		name: "Logout",
		showOnMenu: false,
		appLayout: false
	},
	{
		component: Dashboard,
		path: HOME,
		showOnMenu: false,
		protected: true,
		exact: true,
		name: "Home",
		appLayout: true
	},
];
