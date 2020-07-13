import { createMuiTheme } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";
import { BORDER_RADIUS, BORDER_RADIUS_HALF } from "./constants";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: deepOrange[500],
        },
        secondary: {
            main: deepOrange[300],
        },
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: BORDER_RADIUS,
            },
        },
        MuiFilledInput: {
            root: {
                borderRadius: BORDER_RADIUS,
                borderTopLeftRadius: BORDER_RADIUS,
                borderTopRightRadius: BORDER_RADIUS,
            },
            underline: {
                "&:before": {
                    left: BORDER_RADIUS_HALF,
                    right: BORDER_RADIUS_HALF,
                },
            },
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: BORDER_RADIUS,
            },
        },
        MuiPaper: {
            rounded: {
                borderRadius: BORDER_RADIUS,
            },
        },
        MuiTabs: {
            fixed: {
                borderRadius: BORDER_RADIUS,
            },
        },
        MuiDialog: {
            paper: {
                borderRadius: "4px",
            },
        },
        MuiMenu: {
            paper: {
                borderRadius: "4px",
            },
        },
        MuiSelect: {
            filled: {
                borderRadius: BORDER_RADIUS,
            },
            select: {
                "&:focus": {
                    borderRadius: BORDER_RADIUS,
                },
            },
        },
    },
});
