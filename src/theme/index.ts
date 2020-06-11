import { makeStyles, Theme } from "@material-ui/core/styles";
import { appBar, drawer, drawerPaper, appBarTitle, toolbar, root, content, paper, avatar } from "./app-layout";
import {
	gridForm,
	gridRightMargin,
	pagination,
	addPaper,
	addButtonGrid,
	listHeader,
	listPaper,
	list,
	sortButton,
	search,
	filterGrid,
	linkText,
	noButtonList,
	customSwitch,
	switchLabel,
} from "./list-page";
import { popOver, primaryButton, leftAlignedGrid, centerAlign } from "./generic";
import { profileAvatar, fieldsHeader, fieldsPaper, backButton } from "./profile";
import { tile, tileRow, tileGrid, tileColumn, centeredTile } from "./dashboard";

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
	popOver: popOver(theme),
	avatar: avatar(theme),
	profileAvatar: profileAvatar(theme),
	fieldsHeader: fieldsHeader(theme),
	fieldsPaper: fieldsPaper(theme),
	primaryButton: primaryButton(theme),
	leftAlignedGrid: leftAlignedGrid(theme),
	addPaper: addPaper(theme),
	addButtonGrid: addButtonGrid(theme),
	listHeader: listHeader(theme),
	listPaper: listPaper(theme),
	list: list(theme),
	sortButton: sortButton(theme),
	search: search(theme),
	filterGrid: filterGrid(theme),
	tile: tile(theme),
	tileRow: tileRow(theme),
	tileGrid: tileGrid(theme),
	tileColumn: tileColumn(theme),
	linkText: linkText(theme),
	backButton: backButton(theme),
	noButtonList: noButtonList(theme),
	customSwitch: customSwitch(theme),
	switchLabel: switchLabel(theme),
	centeredTile: centeredTile(theme),
	centerAlign: centerAlign(theme),
}));

export default useStyles;
export * from "./theme";
