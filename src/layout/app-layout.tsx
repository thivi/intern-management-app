import React, { useContext } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	CssBaseline,
} from "@material-ui/core";
import useStyles from "../theme";
import { routes } from "../configs";
import { RouteInterface } from "../models/routes";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../helpers";

export const AppLayout = (props: React.PropsWithChildren<any>): React.ReactElement => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();

	const { authState } = useContext(AuthContext);

	return (
		<div>
			<CssBaseline />
			<AppBar position="static" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" className={classes.appBarTitle}>
						App Name
					</Typography>
					<Button color="inherit">Login</Button>
				</Toolbar>
			</AppBar>
			<div className={classes.root}>
				<Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawerPaper }}>
					<List component="nav">
						{routes.map((route: RouteInterface, index: number) => {
							return route.showOnMenu &&
								((route.permission instanceof Array &&
									route.permission.includes(authState?.authData?.role)) ||
									route.permission === "all" ||
									route.permission === authState?.authData?.role) ? (
								<ListItem
									button
									key={index}
									onClick={() => {
										history.push(route.path);
									}}
									selected={route.path === location.pathname}
								>
									{route.icon ? <ListItemIcon>{route.icon}</ListItemIcon> : null}
									<ListItemText primary={route.name} />
								</ListItem>
							) : null;
						})}
					</List>
				</Drawer>
				<main className={classes.content}>
					<Paper className={classes.paper} square>
						{props.children}
					</Paper>
				</main>
			</div>
		</div>
	);
};
