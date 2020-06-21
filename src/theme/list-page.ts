import { Theme } from "@material-ui/core";
import { BORDER_RADIUS } from "./constants";

export const gridForm = (theme: Theme) => ({
	width: "100%",
	display: "flex"
});

export const gridRightMargin = (theme: Theme) => ({
	marginRight: theme.spacing(1)
});

export const pagination = (theme: Theme) => ({
	display: "flex",
	justifyContent: "center",
	marginTop: theme.spacing(3),
	marginBottom: theme.spacing(4)
});

export const addPaper = (theme: Theme) => ({
	padding: theme.spacing(3)
});

export const addButtonGrid = (theme: Theme) => ({
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "flex-end"
});

export const listHeader = (theme: Theme) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.getContrastText(theme.palette.primary.main)
});

export const listPaper = (theme: Theme) => ({
	marginTop: theme.spacing(4),
	overflow: "hidden"
});

export const list = (theme: Theme) => ({
	paddingTop: 0,
	paddingBottom: 0
});

export const sortButton = (theme: Theme) => ({
	color: theme.palette.getContrastText(theme.palette.primary.main),
	marginRight: theme.spacing(1)
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
	borderRadius: BORDER_RADIUS
});

export const filterGrid = (theme: Theme) => ({
	marginTop: theme.spacing(2),
	marginBottom: theme.spacing(2)
});

export const linkText = (theme: Theme) => ({
	cursor: "pointer",
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1)
});

export const noButtonList = (theme: Theme) => ({
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1)
});

export const customSwitch = (theme: Theme) => ({
	color: theme.palette.secondary.main,
	"&.Mui-checked": {
		color: theme.palette.common.white
	},
	"&.Mui-checked + .MuiSwitch-track": {
		backgroundColor: theme.palette.secondary.light
	}
});

export const switchLabel = (theme: Theme) => ({
	textAlign: "center" as const
});

export const selectMenu = (theme: Theme) => ({
	backgroundColor: theme.palette.primary.light
});

export const roleSelect = (theme: Theme) => ({
	"& .MuiChip-root": {
		marginRight: theme.spacing(1)
	},
	"& .MuiFormHelperText-root": {
		color: theme.palette.error.main
	}
});

export const roleSelectList = (theme: Theme) => ({
	"&.Mui-selected ::before": {
		content: '"\u2713"',
		color: theme.palette.primary.main,
		display: "flex",
		alignItems: "center",
		height: "100%"
	},
	"&.Mui-selected": {
		color: theme.palette.primary.main,
		backgroundColor: "unset",
		marginLeft: theme.spacing()
	}
});

export const roleEmail = (theme: Theme) => ({
	height: "100%",
	"& .MuiInputBase-root": {
		height: "100%"
	}
});

export const roleButton = (theme: Theme) => ({
	height: theme.spacing(6)
});

export const roleErrorLabel = (theme: Theme) => ({
	color: theme.palette.error.main
});

export const roleChip = (theme: Theme) => ({
	marginRight: theme.spacing(),
	marginBottom: theme.spacing(),
	borderColor: theme.palette.primary.main,
	backgroundColor: "unset",
	border: "1px solid",
	color: theme.palette.primary.main
});

export const speedDial = (theme: Theme) => ({
	"& >.MuiFab-root": {
		boxShadow: "none",
		color: theme.palette.text.primary,
		backgroundColor: theme.palette.common.white,

		"&:hover": {
			backgroundColor: theme.palette.grey
		}
	}
});

export const broadList = (theme: Theme) => ({
	minWidth: "1130px"
});

export const broadListWrapper = (theme: Theme) => ({
	overflow: "auto"
});
