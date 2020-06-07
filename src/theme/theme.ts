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
});
