import { Theme } from "@material-ui/core";

export const gridForm = (theme: Theme) => ({
	width: "100%",
	display: "flex",
});

export const gridRightMargin = (theme: Theme) => ({
	marginRight: theme.spacing(1),
});

export const pagination = (theme: Theme) => ({
	display: "flex",
	justifyContent: "center",
	marginTop: theme.spacing(3),
	marginBottom: theme.spacing(4),
});

export const addPaper = (theme: Theme) => ({
	padding: theme.spacing(3),
});

export const addButtonGrid = (theme: Theme) => ({
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "flex-end",
});

export const listHeader = (theme: Theme) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.getContrastText(theme.palette.primary.main),
});

export const listPaper = (theme: Theme) => ({
	marginTop: theme.spacing(4),
	overflow: "hidden",
});

export const list = (theme: Theme) => ({
	paddingTop: 0,
});

export const sortButton = (theme: Theme) => ({
	color: theme.palette.getContrastText(theme.palette.primary.main),
	marginRight: theme.spacing(1),
});

export const search = (theme: Theme) => ({
	backgroundColor: theme.palette.primary.light,
	width: "100%",
	display: "flex",
	justifyContent: "space-between",
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(2),
	border: "none",
	color: theme.palette.getContrastText(theme.palette.primary.light),
	maxHeight: theme.spacing(6),
});

export const filterGrid = (theme: Theme) => ({
	marginTop: theme.spacing(2),
	marginBottom: theme.spacing(2),
});
