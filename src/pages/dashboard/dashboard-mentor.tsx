import React, { ReactElement, useState, useCallback, useEffect, useContext } from "react";
import {
	Typography,
	Button,
	Grid,
	Paper,
	List,
	ListItem,
	ListItemIcon,
	Box,
	Link,
	useMediaQuery,
	Theme
} from "@material-ui/core";
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
	NotificationType
} from "../../models";
import {
	getProfile,
	getBlogs,
	getIssues,
	getPullRequests,
	getPresentationsOrWebinars,
	getProjectTasks,
	getProjects
} from "../../apis";
import { useHistory } from "react-router-dom";
import { INTERNS } from "../../constants";
import { Chart, PieSeries, Title, Legend, Tooltip } from "@devexpress/dx-react-chart-material-ui";

import { Animation, EventTracker } from "@devexpress/dx-react-chart";
import useStyles from "../../theme";
import { findTimeOfTheDay, Notify } from "../../utils";
import { AuthContext, NotificationContext } from "../../helpers";
import { Skeleton } from "@material-ui/lab";
import { WorkOutlineOutlined, EditOutlined } from "@material-ui/icons";
import {
	MorningGraphic,
	NoonGraphic,
	EveningGraphic,
	NightGraphic,
	InternGraphic,
	GitIssueGraphic,
	PullRequestGraphic,
	PresentationGraphic,
	ProjectGraphic,
	BlogGraphic
} from "../../theme/img";

export const DashboardMentor = (): ReactElement => {
	const [internInfo, setInternInfo] = useState<InternInfo>(null);
	const [intern, setIntern] = useState<Intern>(null);
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();

	const { authState } = useContext(AuthContext);
	const { dispatch } = useContext(NotificationContext);

	const classes = useStyles();

	const isSmDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

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
				const profiles = response[0]?.values.filter((value: string[]) => new Date(value[5]) >= new Date());
				const emails = profiles.map((profile: string[]) => profile[0]);
				const blogs = response[1]?.values.filter((value: string[]) => emails.includes(value[0]));
				const gitIssues = response[2].values.filter((value: string[]) => emails.includes(value[0]));
				const pullRequests = response[3].values.filter((value: string[]) => emails.includes(value[0]));
				const presentationsOrWebinars = response[4].values.filter((value: string[]) =>
					emails.includes(value[0])
				);
				const projectTasks = response[5].values.filter((value: string[]) => emails.includes(value[0]));
				const projects = response[6].values.filter((value: string[]) => emails.includes(value[0]));

				const internBlogs: Blog[] = blogs.map((blog: string[]) => ({
					Email_ID: blog[0],
					Title: blog[1],
					Link: blog[2]
				}));

				const internGitIssues: GitIssue[] = gitIssues.map((gitIssue: string[]) => ({
					Email_ID: gitIssue[0],
					Issue_Title: gitIssue[1],
					Link: gitIssue[2]
				}));

				const internPullRequests: PullRequest[] = pullRequests.map((pullRequest: string[]) => ({
					Email_ID: pullRequest[0],
					Title: pullRequest[1],
					Link: pullRequest[2]
				}));

				const internPresentationsOrWebinars: PresentationOrWebinar[] = presentationsOrWebinars.map(
					(presentationsOrWebinar: string[]) => ({
						Email_ID: presentationsOrWebinar[0],
						Title: presentationsOrWebinar[1],
						Link: presentationsOrWebinar[2]
					})
				);

				const internProjectTasks: ProjectTask[] = projectTasks.map((projectTask: string[]) => ({
					Email_ID: projectTask[0],
					Title: projectTask[1],
					PullRequest: projectTask[2],
					Completed: projectTask[3]
				}));

				const internProjects: Project[] = projects.map((project: string[]) => ({
					Email_ID: project[0],
					Title: project[1],
					Mentor: project[2]
				}));

				const internProfiles: Profile[] = profiles.map((profile: string[]) => ({
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
					Gantt_chart: profile[10]
				}));

				const internInfoObj = {
					profiles: internProfiles,
					blogs: internBlogs,
					gitIssues: internGitIssues,
					pullRequests: internPullRequests,
					presentationsOrWebinars: internPresentationsOrWebinars,
					projectTasks: internProjectTasks,
					projects: internProjects
				};

				const completedTasks =
					internProjectTasks.filter((task: ProjectTask) => task.Completed === "yes").length ?? 0;

				const internObj = {
					profiles: internProfiles.length,
					pullRequests: internPullRequests.length,
					gitIssues: internGitIssues.length,
					presentationsOrWebinars: internPresentationsOrWebinars.length,
					projectTasksCompletion:
						Math.round((completedTasks / (internProjectTasks.length ?? 0) || 0) * 100) / 100,
					blogs: internBlogs.length,
					projects: internProjects.length
				};

				setIntern(internObj);
				setInternInfo(internInfoObj);
			})
			.catch((error) => {
				dispatch(Notify({ status: NotificationType.ERROR, message: error }));
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [dispatch]);

	useEffect(() => {
		getInternsCall();
	}, [getInternsCall]);

	const findIllustration = (): string => {
		switch (findTimeOfTheDay().image) {
			case "morning":
				return MorningGraphic;
			case "noon":
				return NoonGraphic;
			case "evening":
				return EveningGraphic;
			case "night":
				return NightGraphic;
		}
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Box
					display="flex"
					alignItems="center"
					justifyContent={isSmDown ? "center" : "start"}
					marginBottom={isSmDown ? 1 : 3}
				>
					<Box marginRight={3}>
						<img width={100} src={findIllustration()} alt="good-morning" />
					</Box>
					<Box display="flex" alignItems="center" width={isSmDown ? "min-content" : "auto"}>
						<Typography variant="h4">
							Good {findTimeOfTheDay().text}, {authState.authData.name}!
						</Typography>
					</Box>
				</Box>
			</Grid>
			<Grid item xs={12} md={6}>
				<Paper className={`${classes.tile} ${classes.centeredTile}`}>
					{!isLoading ? (
						<Box padding={3} width="100%" className={classes.donutChart}>
							<Chart
								data={[
									{
										type: `Completed (${intern.projectTasksCompletion * 100}%)`,
										value: intern?.projectTasksCompletion * 100
									},
									{
										type: `Incomplete (${100 - intern?.projectTasksCompletion * 100}%)`,
										value: 100 - intern?.projectTasksCompletion * 100
									}
								]}
							>
								<PieSeries valueField="value" argumentField="type" innerRadius={0.6} />
								<Title text="Project Tasks Completed" />
								<Animation />
								<Legend />
								<EventTracker />
								<Tooltip />
							</Chart>
						</Box>
					) : (
						<Box padding={3}>
							<Skeleton variant="text" height={70} width={400} />
							<Skeleton variant="circle" height={400} width={400} animation="wave" />
						</Box>
					)}
				</Paper>
			</Grid>
			<Grid container spacing={2} item xs={12} md={6}>
				<Grid container item xs={12} className={classes.tileRow}>
					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							<Box padding={3}>
								<Box display="flex" justifyContent="center">
									<img src={InternGraphic} alt="intern" width={80} />
								</Box>
								{isLoading ? (
									<div className={classes.centerAlign}>
										<Skeleton variant="text" height={80} width={50} />
									</div>
								) : (
									<Typography variant="h3" align="center">
										{intern?.profiles}
									</Typography>
								)}
								<Typography variant="h6" color="textSecondary" align="center">
									Active Interns
								</Typography>
								<Button
									onClick={() => {
										history.push(INTERNS);
									}}
									fullWidth
								>
									More
								</Button>
							</Box>
						</Paper>
					</Grid>

					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							<Box padding={3}>
								<Box display="flex" justifyContent="center">
									<img src={GitIssueGraphic} alt="intern" width={60} />
								</Box>
								{isLoading ? (
									<div className={classes.centerAlign}>
										<Skeleton variant="text" height={80} width={50} />
									</div>
								) : (
									<Typography variant="h3" align="center">
										{intern?.gitIssues}
									</Typography>
								)}
								<Typography variant="h6" color="textSecondary" align="center">
									Git Issues Raised
								</Typography>
							</Box>
						</Paper>
					</Grid>
				</Grid>
				<Grid container item xs={12} className={classes.tileRow}>
					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							<Box padding={3}>
								<Box display="flex" justifyContent="center">
									<img src={PullRequestGraphic} alt="intern" width={80} />
								</Box>
								{isLoading ? (
									<div className={classes.centerAlign}>
										<Skeleton variant="text" height={80} width={50} />
									</div>
								) : (
									<Typography variant="h3" align="center">
										{intern?.pullRequests}
									</Typography>
								)}
								<Typography variant="h6" color="textSecondary" align="center">
									Pull Requests Raised
								</Typography>
							</Box>
						</Paper>
					</Grid>

					<Grid item xs={6} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							<Box padding={3}>
								<Box display="flex" justifyContent="center">
									<img src={PresentationGraphic} alt="intern" width={60} />
								</Box>
								{isLoading ? (
									<div className={classes.centerAlign}>
										<Skeleton variant="text" height={80} width={50} />
									</div>
								) : (
									<Typography variant="h3" align="center">
										{intern?.presentationsOrWebinars}
									</Typography>
								)}
								<Typography variant="h6" color="textSecondary" align="center">
									Presentations / Webinars Done
								</Typography>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} md={6}>
				<Paper className={classes.tile}>
					<Box padding={3}>
						<Box display="flex" justifyContent="center">
							<img src={ProjectGraphic} alt="intern" width={80} />
						</Box>
						{isLoading ? (
							<div className={classes.centerAlign}>
								<Skeleton variant="text" height={80} width={50} />
							</div>
						) : (
							<Typography variant="h3" align="center">
								{intern?.projects}
							</Typography>
						)}
						<Typography variant="h6" color="textSecondary" align="center">
							Projects
						</Typography>
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
											<ListItem key={index}>
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
					</Box>
				</Paper>
			</Grid>
			<Grid item xs={12} md={6} container spacing={2}>
				<Grid container item xs={12}>
					<Grid item xs={12} className={classes.tileGrid}>
						<Paper className={classes.tile}>
							<Box padding={3}>
								<Box display="flex" justifyContent="center">
									<img src={BlogGraphic} alt="intern" width={80} />
								</Box>
								{isLoading ? (
									<div className={classes.centerAlign}>
										<Skeleton variant="text" height={80} width={50} />
									</div>
								) : (
									<Typography variant="h3" align="center">
										{intern?.blogs}
									</Typography>
								)}
								<Typography variant="h6" color="textSecondary" align="center">
									Blogs Written
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
											internInfo?.blogs.map((blog: Blog, index: number) => {
												if (index < 4) {
													return (
														<ListItem key={index}>
															<ListItemIcon>
																<EditOutlined />
															</ListItemIcon>
															<Link target="_blank" href={blog.Link}>
																<Typography>{blog.Title}</Typography>
															</Link>
														</ListItem>
													);
												}

												return null;
											})
										)}
									</List>
								</div>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};
