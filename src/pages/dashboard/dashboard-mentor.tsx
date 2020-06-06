import React, { ReactElement, useState, useCallback, useEffect } from "react";
import { GridList, GridListTile, Card, CardContent, Typography, Button } from "@material-ui/core";
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
import { INTERNS } from "../../constants";
import { Chart, PieSeries, Title, Legend, Tooltip } from "@devexpress/dx-react-chart-material-ui";

import { Animation, EventTracker } from "@devexpress/dx-react-chart";

export const DashboardMentor = (): ReactElement => {
	const [internInfo, setInternInfo] = useState<InternInfo>(null);
	const [intern, setIntern] = useState<Intern>(null);
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();

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
					Gantt_chart: profile[10],
				}));

				const internInfoObj = {
					profiles: internProfiles,
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
					profiles: internProfiles.length,
					pullRequests: internPullRequests.length,
					gitIssues: internGitIssues.length,
					presentationsOrWebinars: internPresentationsOrWebinars.length,
					projectTasksCompletion:
						Math.round((completedTasks / (internProjectTasks.length ?? 0) || 0) * 100) / 100,
					blogs: internBlogs.length,
					projects: internProjects.length,
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
	}, []);

	useEffect(() => {
		getInternsCall();
	}, [getInternsCall]);

	return (
		<>
			{!isLoading && (
				<Chart
					data={[
						{ type: "Completed", value: intern?.projectTasksCompletion * 100 },
						{ type: "InComplete", value: 100 - intern?.projectTasksCompletion * 100 },
					]}
				>
					<PieSeries valueField="value" argumentField="type" innerRadius={0.6} />
					<Title text="Project Tasks Completed" />
					<Animation />
					<Legend />
					<EventTracker />
					<Tooltip />
				</Chart>
			)}
			<GridList cols={3} cellHeight={160}>
				<GridListTile cols={1}>
					<Card>
						<CardContent>
							<Typography variant="h3">{intern?.blogs}</Typography>
							<Typography variant="h6" color="textSecondary">
								Blogs Written
							</Typography>
							<Typography>Latest: {internInfo?.blogs[internInfo?.blogs?.length - 1]?.Title}</Typography>
						</CardContent>
					</Card>
				</GridListTile>
				<GridListTile cols={1}>
					<Card>
						<CardContent>
							<Typography variant="h3">{intern?.gitIssues}</Typography>
							<Typography variant="h6" color="textSecondary">
								Git Issues Raised
							</Typography>
							<Typography>
								Latest: {internInfo?.gitIssues[internInfo?.gitIssues?.length - 1]?.Issue_Title}
							</Typography>
						</CardContent>
					</Card>
				</GridListTile>
				<GridListTile cols={1}>
					<Card>
						<CardContent>
							<Typography variant="h3">{intern?.pullRequests}</Typography>
							<Typography variant="h6" color="textSecondary">
								Pull Requests Raised
							</Typography>
							<Typography>
								Latest: {internInfo?.pullRequests[internInfo?.pullRequests?.length - 1]?.Title}
							</Typography>
						</CardContent>
					</Card>
				</GridListTile>
				<GridListTile cols={1}>
					<Card>
						<CardContent>
							<Typography variant="h3">{intern?.presentationsOrWebinars}</Typography>
							<Typography variant="h6" color="textSecondary">
								Presentations/Webinars Done
							</Typography>
							<Typography>
								Latest:{" "}
								{
									internInfo?.presentationsOrWebinars[internInfo?.presentationsOrWebinars?.length - 1]
										?.Title
								}
							</Typography>
						</CardContent>
					</Card>
				</GridListTile>
				<GridListTile cols={1}>
					<Card>
						<CardContent>
							<Typography variant="h3">{intern?.projects}</Typography>
							<Typography variant="h6" color="textSecondary">
								Projects
							</Typography>
							<Typography>
								Latest: {internInfo?.projects[internInfo?.projects?.length - 1]?.Title}
							</Typography>
						</CardContent>
					</Card>
				</GridListTile>
				<GridListTile cols={1}>
					<Card>
						<CardContent>
							<Typography variant="h3">{intern?.profiles}</Typography>
							<Typography variant="h6" color="textSecondary">
								Active Interns
							</Typography>
							<Typography>
								Latest: {internInfo?.profiles[internInfo?.profiles?.length - 1]?.Name}
							</Typography>
							<Button
								onClick={() => {
									history.push(INTERNS);
								}}
							>
								More
							</Button>
						</CardContent>
					</Card>
				</GridListTile>
			</GridList>
		</>
	);
};
