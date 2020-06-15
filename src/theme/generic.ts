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

export const centerAlign = (theme: Theme) => ({
	display: "flex",
	justifyContent: "center",
});

export const coloredBackground = (theme: Theme) => ({
	backgroundColor: theme.palette.primary.main,
});

export const primaryTextOnColoredBackground = (theme: Theme) => ({
	color: theme.palette.getContrastText(theme.palette.primary.main),
});

export const secondaryTextOnColoredBackground = (theme: Theme) => ({
	color: theme.palette.getContrastText(theme.palette.secondary.light),
});
