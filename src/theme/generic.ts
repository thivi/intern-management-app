import { Theme } from "@material-ui/core";

export const popOver = (theme: Theme) => ({
	pointerEvents: "none" as const,
});

export const primaryButton = (theme: Theme) => ({
	paddingRight: theme.spacing(3),
	paddingLeft: theme.spacing(3),
	paddingTop: theme.spacing(1.75),
	paddingBottom: theme.spacing(1.75),
	fontSize: theme.spacing(2),
});

export const leftAlignedGrid = (theme: Theme) => ({
	marginTop: theme.spacing(4),
	display: "flex",
	justifyContent: "flex-end",
});
