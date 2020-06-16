import React, { useContext } from "react";
import { AuthContext } from "../../helpers";
import { DashboardIntern } from "./dashboard-intern";
import { DashboardMentor } from "./dashboard-mentor";
import { Redirect } from "react-router-dom";
import { INTERN, MENTOR } from "../../constants";

export const Dashboard = (): React.ReactElement => {
	const { authState } = useContext(AuthContext);

	switch (true) {
		case authState.authData.role.includes(INTERN):
			return <DashboardIntern />;
		case authState.authData.role.includes(MENTOR):
			return <DashboardMentor />;
		default:
			return <Redirect to="/" />;
	}
};
