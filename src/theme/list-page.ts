import { Theme } from "@material-ui/core";

export const gridForm = (theme: Theme) => ({
	width: "100%",
	display: "flex",
});

export const gridRightMargin = (theme: Theme) => ({
    marginRight: theme.spacing(1)
})

export const pagination = (theme: Theme) => ({
    display: "flex",
    justifyContent:"center"
})
