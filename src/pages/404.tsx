import React, { ReactElement, useContext } from "react";
import { AuthContext } from "../helpers";
import { Box, Typography } from "@material-ui/core";
import { NotFoundGraphic } from "../theme/img";

export const NotFound = (): ReactElement => {
	const { authState } = useContext(AuthContext);

	return authState?.authData?.role ? (
		<Box display="flex" justifyContent="center">
			<Box width={500}>
				<Box display="flex" justifyContent="center">
					<img src={NotFoundGraphic} alt="not-found" width={500} />
				</Box>
				<Box>
					<Typography variant="h5" align="center">
						The page you're looking for either doesn't exist or you don't have permission to access it.
					</Typography>
					<Typography variant="h6" color="textSecondary" align="center">
						Contact your mentor to obtain the necessary permission.
					</Typography>
				</Box>
			</Box>
		</Box>
	) : null;
};
