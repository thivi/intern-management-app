import { Theme } from "@material-ui/core";
import { DRAWER_WIDTH, TOP_BAR_HEIGHT_SM_UP, TOP_BAR_HEIGHT_SM_DOWN } from "./constants";

const toolbarHeight = (theme: Theme) => (theme.breakpoints.up("sm") ? TOP_BAR_HEIGHT_SM_UP : TOP_BAR_HEIGHT_SM_DOWN);

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
	minHeight: "calc(100vh - " + toolbarHeight(theme) + "px)",
	position: "absolute" as const
});

export const drawer = (theme: Theme) => ({
	width: DRAWER_WIDTH,
	flexShrink: 0,
	position: "relative" as const,
	"& .MuiBackdrop-root": {
		top: toolbarHeight(theme)
	}
});

export const toolbar = (theme: Theme) => theme.mixins.toolbar;

export const root = (theme: Theme) => ({
	display: "flex"
});

export const content = (theme: Theme) => ({
	flexGrow: 1,
	padding: theme.spacing(3)
});

export const paper = (theme: Theme) => ({
	padding: theme.spacing(3)
});

export const floatingMenu = (theme: Theme) => ({
	top: toolbarHeight(theme)+"!important"
});
export const menuIcon = (theme: Theme) => ({
	color: theme.palette.common.white
});
