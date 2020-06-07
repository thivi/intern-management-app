import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Authentication } from "./helpers/authentication";
import { routes } from "./configs";
import { ProtectedRoute } from "./helpers";
import { RouteInterface } from "./models/routes";
import { AppLayout } from "./layout";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";

export const App = (): React.ReactElement => {
	return (
		<BrowserRouter>
			<Authentication>
				<ThemeProvider theme={theme}>
					<Switch>
						{routes?.map((route: RouteInterface, index: number) => {
							if (route.protected) {
								return (
									<ProtectedRoute
										key={index}
										path={route.path}
										exact={route.exact}
										component={route.component}
										appLayout={route.appLayout}
										permission={route.permission}
									/>
								);
							} else {
								return (
									<Route
										key={index}
										path={route.path}
										exact={route.exact}
										component={
											route.appLayout
												? () => (
														<AppLayout>
															<route.component />
														</AppLayout>
												  )
												: route.component
										}
									/>
								);
							}
						})}
					</Switch>
				</ThemeProvider>
			</Authentication>
		</BrowserRouter>
	);
};
