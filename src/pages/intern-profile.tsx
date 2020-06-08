import React, { ReactElement, useState } from "react";
import { Tabs, Tab, Button, Paper, Grid } from "@material-ui/core";
import {
	ProfileTab,
	GitIssuesTab,
	BlogsTab,
	PresentationsOrWebinarsTabs,
	ProjectTasksTab,
	ProjectsTab,
	PullRequestsTab,
} from "./intern-profile-tabs";
import { InternInfo } from "../models";
import { KeyboardBackspaceOutlined } from "@material-ui/icons";
import useStyles from "../theme";

interface InternProfilePropsInterface {
	intern: InternInfo;
	goBack: () => void;
}

export const InternProfile = (props: InternProfilePropsInterface): ReactElement => {
	const [index, setIndex] = useState(0);

	const { intern, goBack } = props;

	const classes = useStyles();

	return (
		<>
			<Grid container spacing={2} className={classes.backButton}>
				<Grid item xs={12}>
					<Button onClick={goBack}>
						<KeyboardBackspaceOutlined />
						Go Back
					</Button>
				</Grid>
			</Grid>

			<Paper>
				<Tabs
					value={index}
					onChange={(event, newIndex: number) => {
						setIndex(newIndex);
					}}
				>
					<Tab label="Profile" />
					<Tab label="Git Issues" />
					<Tab label="Blogs" />
					<Tab label="Presentations/Webinars" />
					<Tab label="Project Tasks" />
					<Tab label="Projects" />
					<Tab label="Pull Requests" />
				</Tabs>
			</Paper>

			{index === 0 && <ProfileTab profile={intern?.profile} />}

			{index !== 0 && (
				<Paper className={classes.listPaper}>
					{index === 1 && <GitIssuesTab gitIssues={intern?.gitIssues} />}
					{index === 2 && <BlogsTab blogs={intern?.blogs} />}
					{index === 3 && (
						<PresentationsOrWebinarsTabs presentationsOrWebinars={intern?.presentationsOrWebinars} />
					)}
					{index === 4 && <ProjectTasksTab projectTasks={intern?.projectTasks} />}
					{index === 5 && <ProjectsTab projects={intern?.projects} />}
					{index === 6 && <PullRequestsTab pullRequests={intern?.pullRequests} />}
				</Paper>
			)}
		</>
	);
};
