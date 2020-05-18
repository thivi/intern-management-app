import { Theme } from "@material-ui/core";
import { DRAWER_WIDTH } from "./constants";

export const appBar = (theme: Theme) => ({
    zIndex: theme.zIndex.drawer + 1
});

export const appBarTitle = (theme: Theme) => ({
    flexGrow: 1
});

export const drawerPaper = (theme: Theme) => ({
    width: DRAWER_WIDTH,
    minHeight: "calc(100vh - "+theme.mixins.toolbar.minHeight+"px)",
	position: "absolute" as const,
});

export const drawer = (theme: Theme) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    position: "relative" as const
});

export const toolbar = (theme: Theme) => theme.mixins.toolbar;

export const root = (theme: Theme) => ({
    display: "flex"
});

export const content = (theme: Theme) => ({
	flexGrow: 1,
	padding:theme.spacing(3)
});

export const paper = (theme: Theme) => ({
	padding: theme.spacing(3)
});
