import React, { useContext } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	CssBaseline,
	Avatar,
	LinearProgress,
	Box
} from "@material-ui/core";
import useStyles from "../theme";
import { routes } from "../configs";
import { RouteInterface } from "../models/routes";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext, useProgressLoader } from "../helpers";
import { hasPermission } from "../utils";

export const AppLayout = (props: React.PropsWithChildren<any>): React.ReactElement => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();

	const { authState } = useContext(AuthContext);

	const progress = useProgressLoader();

	return (
		<Box>
			<CssBaseline />
			<AppBar position="static" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" className={classes.appBarTitle}>
						Intern Management
					</Typography>
					<Typography variant="button">{authState?.authData?.given_name}</Typography>
					<Avatar className={classes.avatar} src={authState?.authData?.picture} />
				</Toolbar>
			</AppBar>
			<div className={classes.root}>
				<Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawerPaper }}>
					<List component="nav">
						{routes.map((route: RouteInterface, index: number) => {
							return (
								route.showOnMenu &&
								(hasPermission(route.permission, authState.authData.role) ? (
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
								) : null)
							);
						})}
					</List>
				</Drawer>
				<main className={classes.content}>
					<div className={classes.paper}>{props.children}</div>
				</main>
			</div>
			{progress !== 0 && (
				<Box position="fixed" bottom={0} zIndex={10000} width="100%">
					<LinearProgress variant="determinate" value={progress} />
				</Box>
			)}
		</Box>
	);
};
