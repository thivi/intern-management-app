import { Theme } from "@material-ui/core";

export const tile = (theme: Theme) => ({
	padding: theme.spacing(2),
	height: "100%",
	display: "flex",
	flexDirection: "column" as const,
	justifyContent: "space-between" as const,
});

export const tileRow = (theme: Theme) => ({
	height: "50%",
});

export const tileGrid = (theme: Theme) => ({
    height: "100%",
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
});

export const tileColumn = (theme: Theme) => ({});
