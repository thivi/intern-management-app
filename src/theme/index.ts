import { makeStyles, Theme } from "@material-ui/core/styles";
import { signInGrid, signInPaper } from "./sign-in";
import { appBar, drawer, drawerPaper, appBarTitle, toolbar, root, content, paper } from "./app-layout";
import { gridGeneric, listSecondary, dangerButton, fab } from "./list-page";

const useStyles = makeStyles((theme: Theme) => ({
    signInGrid: signInGrid(theme),
    signInPaper: signInPaper(theme),
    appBar: appBar(theme),
    drawer: drawer(theme),
    drawerPaper: drawerPaper(theme),
    appBarTitle: appBarTitle(theme),
    toolbar: toolbar(theme),
    root: root(theme),
	content: content(theme),
    paper: paper(theme),
    gridGeneric: gridGeneric(theme),
    listSecondary: listSecondary(theme),
    dangerButton: dangerButton(theme),
    fab : fab(theme)
}));

export default useStyles;
