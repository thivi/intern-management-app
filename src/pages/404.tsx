import React, { ReactElement, useContext } from "react";
import { AuthContext } from "../helpers";

export const NotFound = (): ReactElement => {
	const { authState } = useContext(AuthContext);

	return authState?.authData?.role ? <h1>Page Not Found</h1> : null;
};
