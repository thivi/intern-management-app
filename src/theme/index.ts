import { makeStyles, Theme } from "@material-ui/core/styles";
import {
    appBar,
    drawer,
    drawerPaper,
    appBarTitle,
    toolbar,
    root,
    content,
    paper,
    avatar,
    menuIcon,
    floatingMenu,
} from "./app-layout";
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
    selectMenu,
    roleSelect,
    roleSelectList,
    roleEmail,
    roleButton,
    roleErrorLabel,
    roleChip,
    speedDial,
    broadList,
    broadListWrapper,
    noOverFlowScrollGrid,
    editDatePicker,
    rightCenterFlex,
} from "./list-page";
import {
    popOver,
    primaryButton,
    leftAlignedGrid,
    centerAlign,
    coloredBackground,
    primaryTextOnColoredBackground,
    secondaryTextOnColoredBackground,
    overflowHidden,
    overflowWrapAnywhere,
} from "./generic";
import { profileAvatar, fieldsHeader, fieldsPaper, backButton } from "./profile";
import { tile, tileRow, tileGrid, donutChart, centeredTile, tileContainer } from "./dashboard";
import { placeholderImage } from "./placeholders";
import { heartBeatAnimation } from './logo-animation';

const useStyles = makeStyles(
    (theme: Theme) => ({
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
        donutChart: donutChart(theme),
        linkText: linkText(theme),
        backButton: backButton(theme),
        noButtonList: noButtonList(theme),
        customSwitch: customSwitch(theme),
        switchLabel: switchLabel(theme),
        centeredTile: centeredTile(theme),
        centerAlign: centerAlign(theme),
        placeholderImage: placeholderImage(theme),
        selectMenu: selectMenu(theme),
        coloredBackground: coloredBackground(theme),
        primaryTextOnColoredBackground: primaryTextOnColoredBackground(theme),
        secondaryTextOnColoredBackground: secondaryTextOnColoredBackground(theme),
        roleSelect: roleSelect(theme),
        roleSelectList: roleSelectList(theme),
        roleEmail: roleEmail(theme),
        roleButton: roleButton(theme),
        roleErrorLabel: roleErrorLabel(theme),
        roleChip: roleChip(theme),
        menuIcon: menuIcon(theme),
        floatingMenu: floatingMenu(theme),
        speedDial: speedDial(theme),
        broadList: broadList(theme),
        broadListWrapper: broadListWrapper(theme),
        noOverFlowScrollGrid: noOverFlowScrollGrid(theme),
        overflowHidden: overflowHidden(theme),
        tileContainer: tileContainer(theme),
        editDatePicker: editDatePicker(theme),
        rightCenterFlex: rightCenterFlex(theme),
        overflowWrapAnywhere: overflowWrapAnywhere(theme),
        heartBeatAnimation: heartBeatAnimation(theme),
        "@keyframes heartbeat": {
            "0%": {
                transform: "scale(0.4)"
            },
            "20%": {
                transform: "scale(0.5)"
            },
            "35%": {
                transform: "scale(0.4)"
            },
            "85%": {
                transform: "scale(0.6)"
            },
            "100%": {
                transform: "scale(0.4)"
            }
        }
    }),
    { index: 1 }
);

export default useStyles;
export * from "./theme";
