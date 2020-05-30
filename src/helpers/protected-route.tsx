import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from ".";
import { updateCallbackUrl } from "../utils";
import { AppLayout } from "../layout";
import { LOGIN, NOT_FOUND } from "../constants";
import { Permissions } from "../models";

interface ProtectedRoutePropsInterface {
	path: string;
	component: React.FunctionComponent | React.ComponentClass;
	exact: boolean;
	appLayout: boolean;
	permission: Permissions;
}
export const ProtectedRoute = (props: ProtectedRoutePropsInterface): React.ReactElement => {
	const { path, component, exact, appLayout, permission } = props;
	const { authState } = useContext(AuthContext);

	updateCallbackUrl(path);

	if (authState?.authenticated) {
		if (authState?.authData?.role === permission) {
			const route = <Route path={path} component={component} exact={exact} />;
			return appLayout ? <AppLayout>{route}</AppLayout> : route;
		} else if (path === NOT_FOUND) {
			const route = <Route path={path} component={component} exact={exact} />;
			return appLayout ? <AppLayout>{route}</AppLayout> : route;
		} else {
			return <Redirect to={NOT_FOUND} />;
		}
	} else {
		return <Redirect to={LOGIN} />;
	}
};
