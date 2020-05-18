import { Theme } from "@material-ui/core";

export const gridGeneric = (theme: Theme) => ({
    padding: theme.spacing(3)
});

export const listSecondary = (theme: Theme) => ({
    display: "flex",
    flexDirection: "column" as const
});

export const dangerButton = (theme: Theme) => ({
    color: "red"
});

export const fab = (theme: Theme) => ({
    position: "fixed" as const,
    zIndex: 100,
    top: "calc(100vh - 175px)",
    right: "100px"
})
