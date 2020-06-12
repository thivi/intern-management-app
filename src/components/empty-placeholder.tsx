import React, { ReactElement } from "react";
import { Box, Typography } from "@material-ui/core";
import { BoxGraphic } from "../theme/img";
import useStyles from "../theme";

interface EmptyPlaceholderPropsInterface {
	title: string;
	subtitle: string;
}
export const EmptyPlaceholder = (props: EmptyPlaceholderPropsInterface): ReactElement => {
	const classes = useStyles();

	const { title, subtitle } = props;

	return (
		<Box display="flex" justifyContent="center" padding={10}>
			<Box textAlign="center">
				<img src={BoxGraphic} alt="box-graphic" className={classes.placeholderImage} />
				<Typography variant="h4">{title}</Typography>
				<Typography color="textSecondary" variant="h6">
					{subtitle}
				</Typography>
			</Box>
		</Box>
	);
};
