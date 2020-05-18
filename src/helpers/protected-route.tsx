import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from ".";
import { updateCallbackUrl } from "../utils";
import { AppLayout } from "../layout";

interface ProtectedRoutePropsInterface {
	path: string;
	component: React.FunctionComponent | React.ComponentClass;
	exact: boolean;
	appLayout: boolean;
}
export const ProtectedRoute = (props: ProtectedRoutePropsInterface): React.ReactElement => {
	const { path, component, exact, appLayout } = props;
	const { authState } = useContext(AuthContext);

	updateCallbackUrl(path);

	if (authState.authenticated) {
		const route = <Route path={path} component={component} exact={exact} />;
		return appLayout ? <AppLayout>{route}</AppLayout> : route;
	} else {
		return <Redirect to="/login" />;
	}
};
