import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Authentication, Notification } from "./helpers";
import { routes } from "./configs";
import { ProtectedRoute } from "./helpers";
import { RouteInterface } from "./models/routes";
import { AppLayout, NotificationComponent } from "./layout";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./theme";

export const App = (): React.ReactElement => {
	return (
		<BrowserRouter>
			<Authentication>
				<ThemeProvider theme={theme}>
					<Notification>
						<NotificationComponent />
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
					</Notification>
				</ThemeProvider>
			</Authentication>
		</BrowserRouter>
	);
};
