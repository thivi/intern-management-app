import { createMuiTheme } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";

export const theme = createMuiTheme({
	palette: {
		primary: {
			main: purple[700],
		},
		secondary: {
			main: purple[600],
		},
	},
	overrides: {
		MuiButton: {
			root: {
				borderRadius: "40px",
			},
		},
		MuiInputBase: {
			root: {
				borderRadius: "40px",
			},
		},
		MuiOutlinedInput: {
			root: {
				borderRadius: "40px",
			},
		},
		MuiPaper: {
			rounded: {
				borderRadius: "40px",
			},
		},
	},
});
