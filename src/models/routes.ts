export interface RouteInterface {
	component: React.FunctionComponent | React.ComponentClass;
	path: string;
	exact: boolean;
	protected: boolean;
	showOnMenu: boolean;
	name: string;
	icon?: React.ReactElement | null | undefined;
	appLayout: boolean;
}
