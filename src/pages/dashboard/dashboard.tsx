import React, { useContext } from "react";
import { AuthContext } from "../../helpers";
import { DashboardIntern } from "./dashboard-intern";
import { DashboardMentor } from "./dashboard-mentor";
import { Redirect } from "react-router-dom";

export const Dashboard = (): React.ReactElement => {
	const { authState } = useContext(AuthContext);

	switch (authState.authData.role) {
		case "intern":
			return <DashboardIntern />;
		case "mentor":
			return <DashboardMentor />;
		default:
			return <Redirect to="/" />;
	}
};
