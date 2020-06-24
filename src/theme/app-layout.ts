import { Theme } from "@material-ui/core";
import { DRAWER_WIDTH, TOP_BAR_HEIGHT_SM_UP, TOP_BAR_HEIGHT_SM_DOWN } from "./constants";

export const appBar = (theme: Theme) => ({
	zIndex: theme.zIndex.drawer + 1
});

export const appBarTitle = (theme: Theme) => ({
	flexGrow: 1
});

export const avatar = (theme: Theme) => ({
	marginLeft: theme.spacing(1)
});

export const drawerPaper = (theme: Theme) => ({
	width: DRAWER_WIDTH,
	minHeight: "calc(100vh - " + TOP_BAR_HEIGHT_SM_UP + "px)",
	[`${theme.breakpoints.down("sm")}`]: {
		minHeight: "calc(100vh - " + TOP_BAR_HEIGHT_SM_DOWN + "px)"
	},
	position: "absolute" as const
});

export const drawer = (theme: Theme) => ({
	width: DRAWER_WIDTH,
	flexShrink: 0,
	position: "relative" as const,
	"& .MuiBackdrop-root": {
		top: TOP_BAR_HEIGHT_SM_UP,
		[`${theme.breakpoints.down("sm")}`]: {
			top: TOP_BAR_HEIGHT_SM_DOWN
		}
	}
});

export const toolbar = (theme: Theme) => theme.mixins.toolbar;

export const root = (theme: Theme) => ({
	display: "flex",
	minHeight: "calc(100vh - " + TOP_BAR_HEIGHT_SM_UP + ")",
	[`${theme.breakpoints.down("xs")}`]: {
		minHeight: "calc(100vh - " + TOP_BAR_HEIGHT_SM_DOWN + ")"
	}
});

export const content = (theme: Theme) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	[`${theme.breakpoints.down("md")}`]: {
		padding: theme.spacing()
	},
	overflow: "auto"
});

export const paper = (theme: Theme) => ({
	padding: theme.spacing(3),
	[`${theme.breakpoints.down("md")}`]: {
		padding: theme.spacing()
	}
});

export const floatingMenu = (theme: Theme) => ({
	top: TOP_BAR_HEIGHT_SM_UP + "!important",
	[`${theme.breakpoints.down("sm")}`]: {
		top: TOP_BAR_HEIGHT_SM_DOWN + "!important"
	}
});

export const menuIcon = (theme: Theme) => ({
	color: theme.palette.common.white
});
