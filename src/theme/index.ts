import { makeStyles, Theme } from "@material-ui/core/styles";
import { appBar, drawer, drawerPaper, appBarTitle, toolbar, root, content, paper } from "./app-layout";
import { gridForm, gridRightMargin, pagination } from "./list-page";

const useStyles = makeStyles((theme: Theme) => ({
	appBar: appBar(theme),
	drawer: drawer(theme),
	drawerPaper: drawerPaper(theme),
	appBarTitle: appBarTitle(theme),
	toolbar: toolbar(theme),
	root: root(theme),
	content: content(theme),
	paper: paper(theme),
	gridForm: gridForm(theme),
	gridRightMargin: gridRightMargin(theme),
	pagination: pagination(theme),
}));

export default useStyles;
