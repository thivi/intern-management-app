import React, { ReactElement, useContext, useState, useCallback, useEffect } from "react";
import { Typography, Button, Paper, Grid, List, ListItem, ListItemIcon } from "@material-ui/core";
import { AuthContext } from "../../helpers";
import {
	Blog,
	GitIssue,
	PullRequest,
	PresentationOrWebinar,
	ProjectTask,
	Project,
	Profile,
	InternInfo,
	Intern,
} from "../../models";
import {
	getProfile,
	getBlogs,
	getIssues,
	getPullRequests,
	getPresentationsOrWebinars,
	getProjectTasks,
	getProjects,
} from "../../apis";
import { useHistory } from "react-router-dom";
import {
	BLOGS_PATH,
	PROJECTS_PATH,
	PRESENTATIONS_OR_WEBINARS_PATH,
	PULL_REQUESTS_PATH,
	GIT_ISSUES_PATH,
} from "../../constants";
import { Chart, PieSeries, Title, Legend, Tooltip } from "@devexpress/dx-react-chart-material-ui";

import { Animation, EventTracker } from "@devexpress/dx-react-chart";
import useStyles from "../../theme";
import { findTimeOfTheDay } from "../../utils";
import { Skeleton } from "@material-ui/lab";
import { WorkOutlineOutlined } from "@material-ui/icons";

export const DashboardIntern = (): ReactElement => {
	const { authState } = useContext(AuthContext);

	const [internInfo, setInternInfo] = useState<InternInfo>(null);
	const [intern, setIntern] = useState<Intern>(null);
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();

	const classes = useStyles();

	const getInternsCall = useCallback(() => {
		setIsLoading(true);
		const profile = getProfile();
		const blogs = getBlogs();
		const gitInterns = getIssues();
		const pullRequests = getPullRequests();
		const presentationsOrWebinars = getPresentationsOrWebinars();
		const projectTasks = getProjectTasks();
		const projects = getProjects();

		Promise.all([profile, blogs, gitInterns, pullRequests, presentationsOrWebinars, projectTasks, projects])
			.then((response) => {
				const email = authState.authData.email;

				const profile = response[0]?.values.filter((value: string[]) => value[0] === email);
				const blogs = response[1]?.values.filter((value: string[]) => value[0] === email);
				const gitIssues = response[2].values.filter((value: string[]) => value[0] === email);
				const pullRequests = response[3].values.filter((value: string[]) => value[0] === email);
				const presentationsOrWebinars = response[4].values.filter((value: string[]) => value[0] === email);
				const projectTasks = response[5].values.filter((value: string[]) => value[0] === email);
				const projects = response[6].values.filter((value: string[]) => value[0] === email);

				const internBlogs: Blog[] = blogs.map((blog: string[]) => ({
					Email_ID: blog[0],
					Title: blog[1],
					Link: blog[2],
				}));

				const internGitIssues: GitIssue[] = gitIssues.map((gitIssue: string[]) => ({
					Email_ID: gitIssue[0],
					Issue_Title: gitIssue[1],
					Link: gitIssue[2],
				}));

				const internPullRequests: PullRequest[] = pullRequests.map((pullRequest: string[]) => ({
					Email_ID: pullRequest[0],
					Title: pullRequest[1],
					Link: pullRequest[2],
				}));

				const internPresentationsOrWebinars: PresentationOrWebinar[] = presentationsOrWebinars.map(
					(presentationsOrWebinar: string[]) => ({
						Email_ID: presentationsOrWebinar[0],
						Title: presentationsOrWebinar[1],
						Link: presentationsOrWebinar[2],
					})
				);

				const internProjectTasks: ProjectTask[] = projectTasks.map((projectTask: string[]) => ({
					Email_ID: projectTask[0],
					Title: projectTask[1],
					PullRequest: projectTask[2],
					Completed: projectTask[3],
				}));

				const internProjects: Project[] = projects.map((project: string[]) => ({
					Email_ID: project[0],
					Title: project[1],
					Mentor: project[2],
				}));

				const internProfile: Profile = {
					Email_ID: profile[0],
					Name: profile[1],
					University: profile[2],
					Degree: profile[3],
					Joined_date: profile[4],
					Leaving_date: profile[5],
					Contact_no: profile[6],
					Mentor: profile[7],
					Co_mentor: profile[8],
					Blog: profile[9],
					Gantt_chart: profile[10],
				};

				const internInfoObj = {
					profile: internProfile,
					blogs: internBlogs,
					gitIssues: internGitIssues,
					pullRequests: internPullRequests,
					presentationsOrWebinars: internPresentationsOrWebinars,
					projectTasks: internProjectTasks,
					projects: internProjects,
				};

				const completedTasks =
					internProjectTasks.filter((task: ProjectTask) => task.Completed === "yes").length ?? 0;

				const internObj = {
					profile: internProfile,
					email: internProfile.Email_ID,
					pullRequests: internPullRequests.length,
					gitIssues: internGitIssues.length,
					presentationsOrWebinars: internPresentationsOrWebinars.length,
					projectTasksCompletion:
						Math.round((completedTasks / (internProjectTasks.length ?? 0) || 0) * 100) / 100,
					name: internProfile.Name,
					blogs: internBlogs.length,
					projects: internProjects,
				};

				setIntern(internObj);
				setInternInfo(internInfoObj);
			})
			.catch((error) => {
				//TODO: Notify
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [authState]);

	useEffect(() => {
		getInternsCall();
	}, [getInternsCall]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h4">
					Good {findTimeOfTheDay()}, {authState.authData.name}!
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<Paper className={`${classes.tile} ${classes.centeredTile}`}>
					{!isLoading ? (
						<Chart
							data={[
								{
									type: `Completed (${intern.projectTasksCompletion * 100}%)`,
									value: intern?.projectTasksCompletion * 100,
								},
								{
									type: `Incomplete (${100 - intern?.projectTasksCompletion * 100}%)`,
									value: 100 - intern?.projectTasksCompletion * 100,
								},
							]}
							width={500}
						>
							<PieSeries valueField="value" argumentField="type" innerRadius={0.6} />
							<Title text="Project Tasks Completed" />
							<Animation />
							<Legend />
							<EventTracker />
							<Tooltip />
						</Chart>
					) : (
						<>
							<Skeleton variant="text" height={70} width={400} />
							<Skeleton variant="circle" height={400} width={400} animation="wave" />
						</>
					)}
				</Paper>
			</Grid>
			<Grid container spacing={2} item xs={6} className={classes.tileColumn}>
				<Grid container item xs={12} className={classes.tileRow}>
					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							{isLoading ? (
								<div className={classes.centerAlign}>
									<Skeleton variant="text" height={100} width={50} />
								</div>
							) : (
								<Typography variant="h3" align="center">
									{intern?.blogs}
								</Typography>
							)}
							<Typography variant="h6" align="center" color="textSecondary">
								Blogs Written
							</Typography>
							<Button
								onClick={() => {
									history.push(BLOGS_PATH);
								}}
							>
								More
							</Button>
						</Paper>
					</Grid>
					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							{isLoading ? (
								<div className={classes.centerAlign}>
									<Skeleton variant="text" height={100} width={50} />
								</div>
							) : (
								<Typography variant="h3" align="center">
									{intern?.gitIssues}
								</Typography>
							)}
							<Typography variant="h6" color="textSecondary" align="center">
								Git Issues Raised
							</Typography>
							<Button
								onClick={() => {
									history.push(GIT_ISSUES_PATH);
								}}
							>
								More
							</Button>
						</Paper>
					</Grid>
				</Grid>
				<Grid container item xs={12} className={classes.tileRow}>
					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							{isLoading ? (
								<div className={classes.centerAlign}>
									<Skeleton variant="text" height={100} width={50} />
								</div>
							) : (
								<Typography variant="h3" align="center">
									{intern?.pullRequests}
								</Typography>
							)}
							<Typography variant="h6" align="center" color="textSecondary">
								Pull Requests Raised
							</Typography>
							<Button
								onClick={() => {
									history.push(PULL_REQUESTS_PATH);
								}}
							>
								More
							</Button>
						</Paper>
					</Grid>
					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							{isLoading ? (
								<div className={classes.centerAlign}>
									<Skeleton variant="text" height={100} width={50} />
								</div>
							) : (
								<Typography variant="h3" align="center">
									{intern?.presentationsOrWebinars}
								</Typography>
							)}
							<Typography variant="h6" align="center" color="textSecondary">
								Presentations/Webinars Done
							</Typography>
							<Button
								onClick={() => {
									history.push(PRESENTATIONS_OR_WEBINARS_PATH);
								}}
							>
								More
							</Button>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Paper className={classes.tile}>
					{isLoading ? (
						<div className={classes.centerAlign}>
							<Skeleton variant="text" height={100} width={50} />
						</div>
					) : (
						<Typography variant="h3" align="center">
							{intern?.projects instanceof Array && intern?.projects.length}
						</Typography>
					)}
					<Typography variant="h6" color="textSecondary" align="center">
						Projects
					</Typography>
					<div>
						<Typography variant="subtitle1">Latest: </Typography>
						<List>
							{isLoading ? (
								<>
									<Skeleton variant="text" height={50} />
									<Skeleton variant="text" height={50} />
									<Skeleton variant="text" height={50} />
									<Skeleton variant="text" height={50} />
									<Skeleton variant="text" height={50} />
								</>
							) : (
								internInfo?.projects.map((project: Project, index: number) => {
									if (index < 4) {
										return (
											<ListItem>
												<ListItemIcon>
													<WorkOutlineOutlined />
												</ListItemIcon>
												<Typography>{project.Title}</Typography>
											</ListItem>
										);
									}

									return null;
								})
							)}
						</List>
					</div>
					<Button
						onClick={() => {
							history.push(PROJECTS_PATH);
						}}
					>
						More
					</Button>
				</Paper>
			</Grid>
		</Grid>
	);
};
