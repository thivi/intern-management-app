import React, { ReactElement, useContext } from "react";
import { AuthContext } from "../helpers";
import { findHome } from "../utils";
import { Redirect } from "react-router-dom";

export const Home = (): ReactElement => {
	const { authState } = useContext(AuthContext);

    if (authState.authData.role) {
        return <Redirect to={findHome(authState?.authData?.role)} exact={true} path="/" />;
    } else {
        return <div>Loading</div>;
    }
};
