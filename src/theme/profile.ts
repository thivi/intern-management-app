import { Theme } from "@material-ui/core";

export const profileAvatar = (theme: Theme) => ({
	width: "100%",
	height: "auto",
});

export const fieldsHeader = (theme: Theme) => ({
	marginBottom: theme.spacing(4),
});

export const fieldsPaper = (theme: Theme) => ({
	marginTop: theme.spacing(4),
	padding: theme.spacing(3),
});

export const backButton = (theme: Theme) => ({
	marginBottom: theme.spacing(1),
});
