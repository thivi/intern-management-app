import { Theme } from "@material-ui/core";

export const tile = (theme: Theme) => ({
	padding: theme.spacing(2),
	height: "100%",
	display: "flex",
	flexDirection: "column" as const,
	justifyContent: "space-between" as const
});

export const centeredTile = (theme: Theme) => ({
	alignItems: "center"
});

export const tileRow = (theme: Theme) => ({
	height: "50%"
});

export const tileGrid = (theme: Theme) => ({
	height: "100%"
});

export const donutChart = (theme: Theme) => ({
	"& #center-container": {
		flexDirection: "column!important"
	}
});

export const tileContainer = (theme: Theme) => ({
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gridRowGap: theme.spacing(),
	gridColumnGap: theme.spacing(),
	padding: theme.spacing(),
	[`${theme.breakpoints.down("xs")}`]: {
		gridTemplateColumns: "1fr"
	},
	width: "100%"
});
