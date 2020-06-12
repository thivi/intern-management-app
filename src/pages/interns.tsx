import React, { ReactElement, useState, useContext, useCallback, useEffect, ChangeEvent, useRef } from "react";
import {
	Grid,
	List,
	ListItem,
	Divider,
	IconButton,
	Typography,
	Popover,
	ListItemText,
	FormControlLabel,
	Switch,
	Paper,
	InputBase,
} from "@material-ui/core";
import {
	Intern,
	Profile,
	PullRequest,
	GitIssue,
	PresentationOrWebinar,
	ProjectTask,
	InternInfo,
	Blog,
	Project,
	NotificationType,
} from "../models";
import {
	getBlogs,
	getProfile,
	getIssues,
	getPullRequests,
	getPresentationsOrWebinars,
	getProjectTasks,
	getProjects,
} from "../apis";
import { AuthContext, NotificationContext } from "../helpers";
import { Close, Sort, Search } from "@material-ui/icons";
import { Skeleton, Pagination } from "@material-ui/lab";
import useStyles from "../theme";
import { InternProfile } from ".";
import { Notify } from "../utils";
import { EmptyPlaceholder, NoResultPlaceholder } from "../components";

const SORT_BY: {
	key: keyof Intern;
	text: string;
}[] = [
	{
		key: "name",
		text: "Name",
	},
	{
		key: "blogs",
		text: "No. of Blogs",
	},
	{
		key: "email",
		text: "Email",
	},
	{
		key: "gitIssues",
		text: "No. of GitIssues",
	},
	{
		key: "presentationsOrWebinars",
		text: "No. of Presentations/Webinars",
	},
	{
		key: "projectTasksCompletion",
		text: "Project Completion",
	},
	{
		key: "pullRequests",
		text: "No. of Pull Requests",
	},
];

interface Sort {
	name: boolean;
	blogs: boolean;
	email: boolean;
	gitIssues: boolean;
	presentationsOrWebinars: boolean;
	projectTasksCompletion: boolean;
	pullRequests: boolean;
	[key: string]: boolean;
}

export const Interns = (): ReactElement => {
	const [paginatedInterns, setPaginatedInterns] = useState<Intern[]>([]);
	const [filteredInterns, setFilteredInterns] = useState<Intern[]>([]);
	const { authState } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState<Sort>({
		name: true,
		blogs: true,
		email: true,
		gitIssues: true,
		presentationsOrWebinars: true,
		projectTasksCompletion: true,
		pullRequests: true,
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState<Sort>({
		name: false,
		blogs: false,
		email: false,
		gitIssues: false,
		presentationsOrWebinars: false,
		projectTasksCompletion: false,
		pullRequests: false,
	});
	const [internInfo, setInternInfo] = useState<InternInfo[]>([]);
	const [interns, setInterns] = useState<Intern[]>([]);
	const [popOverIndex, setPopOverIndex] = useState(-1);
	const [anchorEl, setAnchorEl] = useState(null);
	const [showOnlyMentees, setShowOnlyMentees] = useState(false);
	const [showOnlyActive, setShowOnlyActive] = useState(false);
	const [showInternProfile, setShowInternProfile] = useState(false);
	const [selectedIntern, setSelectedIntern] = useState<InternInfo>(null);

	const itemsPerPage = 10;

	const classes = useStyles();

	const init = useRef(true);

	const isActive = useCallback((intern: Intern): boolean => {
		return new Date(intern.profile.Leaving_date) >= new Date();
	}, []);

	const isMentee = useCallback(
		(intern: Intern): boolean => {
			return (
				intern.profile.Mentor === authState.authData.email ||
				intern.profile.Co_mentor === authState.authData.email
			);
		},
		[authState]
	);

	const { dispatch } = useContext(NotificationContext);

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
				const profiles: string[][] = response[0].values;
				const internInfos: InternInfo[] = [];
				const internsList: Intern[] = [];

				profiles.forEach((profile, index: number) => {
					if (index === 0) return -1;
					const email = profile[0];

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

					internInfos.push({
						profile: internProfile,
						blogs: internBlogs,
						gitIssues: internGitIssues,
						pullRequests: internPullRequests,
						presentationsOrWebinars: internPresentationsOrWebinars,
						projectTasks: internProjectTasks,
						projects: internProjects,
					});

					const completedTasks =
						internProjectTasks.filter((task: ProjectTask) => task.Completed === "yes").length ?? 0;

					internsList.push({
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
					});
				});
				setInternInfo(internInfos);
				setInterns(internsList);

				const filteredInterns = internsList.filter((intern: Intern) => {
					const query = searchQuery.toLowerCase();
					const matchesQuery = intern.name.toLowerCase().includes(query);
					const showActive = showOnlyActive ? isActive(intern) : true;
					const showMentees = showOnlyMentees ? isMentee(intern) : true;
					return matchesQuery && showActive && showMentees;
				});

				let internsToPaginate;

				if (sorted[sortBy]) {
					let sortedArray = [...filteredInterns].sort((a: Intern, b: Intern) => {
						if (sortBy === "name" || sortBy === "email") {
							if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
							else return -1;
						} else if (sortBy !== "profile" && sortBy !== "projects") {
							if (a[sortBy] - b[sortBy]) return 1;
							else return -1;
						}
						return -1;
					});

					if (!sortOrder[sortBy]) sortedArray = sortedArray.reverse();

					internsToPaginate = [...sortedArray];
				} else {
					internsToPaginate = [...filteredInterns];
				}

				setFilteredInterns(internsToPaginate);

				let currentPage = page;

				if (internsToPaginate.length !== 0 && Math.ceil(internsToPaginate.length / itemsPerPage) < page) {
					currentPage = Math.ceil(internsToPaginate.length / itemsPerPage);
					setPage(currentPage);
				}

				const paginateInterns = internsToPaginate.slice(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage
				);
				setPaginatedInterns(paginateInterns);
			})
			.catch((error) => {
				dispatch(
					Notify({
						status: NotificationType.ERROR,
						message: error,
					})
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [searchQuery, sortOrder, sorted, sortBy, page, isActive, isMentee, showOnlyMentees, showOnlyActive, dispatch]);

	useEffect(() => {
		if (init.current && getInternsCall && authState.authData) {
			getInternsCall();
			init.current = false;
		}
	}, [getInternsCall, authState.authData]);

	const listSkeletons = (): ReactElement => {
		const skeletons: ReactElement[] = [];
		for (let i = 0; i < 10; i++) {
			skeletons.push(
				<ListItem key={i}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Skeleton variant="text" height={50} />
						</Grid>
					</Grid>
				</ListItem>
			);
		}

		return <List>{skeletons}</List>;
	};

	const sort = (sortBy: keyof Intern, order?: boolean) => {
		let sortedArray = [...filteredInterns].sort((a: Intern, b: Intern) => {
			if (sortBy === "name" || sortBy === "email") {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			} else if (sortBy !== "profile" && sortBy !== "projects") {
				return a[sortBy] - b[sortBy];
			}

			return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredInterns(sortedArray);
		setPaginatedInterns(sortedArray.slice(0, itemsPerPage));
		setPage(1);

		const tempSortOrder: Sort = { ...sortOrder };
		tempSortOrder[sortBy] = order;
		sorted[sortBy] && setSortOrder(tempSortOrder);
		const tempSorted: Sort = { ...sorted };
		tempSorted[sortBy] = true;
		setSorted(tempSorted);
	};

	const search = (search: string, active?: boolean, mentees?: boolean) => {
		const filteredInterns = interns.filter((Intern: Intern) => {
			const query = active || mentees ? searchQuery.toLowerCase() : search.toLowerCase();
			const matchesQuery = Intern.name.toLowerCase().includes(query);
			const showActive = (active && !showOnlyActive) || (!active && showOnlyActive) ? isActive(Intern) : true;
			const showMentees =
				(mentees && !showOnlyMentees) || (!mentees && showOnlyMentees) ? isMentee(Intern) : true;
			return matchesQuery && showActive && showMentees;
		});

		if (active) {
			setShowOnlyActive(!showOnlyActive);
		}

		if (mentees) {
			setShowOnlyMentees(!showOnlyMentees);
		}

		let sortedArray = [...filteredInterns];
		if (sorted) {
			sortedArray = [...filteredInterns].sort((a: Intern, b: Intern) => {
				if (sortBy === "name" || sortBy === "email") {
					if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
					else return -1;
				} else if (sortBy !== "profile" && sortBy !== "projects") {
					if (a[sortBy] - b[sortBy]) return 1;
					else return -1;
				}

				return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();
		}

		setFilteredInterns(sortedArray);
		setPaginatedInterns(sortedArray.slice(0, itemsPerPage));
		setPage(1);
	};

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedInterns(filteredInterns.slice((value - 1) * itemsPerPage, value * itemsPerPage));
	};

	const handlePopOverOpen = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, index: number) => {
		setPopOverIndex(index);
		setAnchorEl(event.currentTarget);
	};

	const handlePopOverClose = () => {
		setPopOverIndex(-1);
		setAnchorEl(null);
	};

	return (
		<>
			{showInternProfile ? (
				<InternProfile
					intern={selectedIntern}
					goBack={() => {
						setSelectedIntern(null);
						setShowInternProfile(false);
					}}
				/>
			) : (
				<>
					<Paper variant="elevation" className={classes.listPaper}>
						<List className={classes.list}>
							<ListItem className={classes.listHeader}>
								<Grid container spacing={2} className={classes.filterGrid}>
									<Grid item xs={2}>
										<FormControlLabel
											control={
												<Switch
													checked={showOnlyActive}
													onChange={() => search("", true, false)}
													color="secondary"
													classes={{
														switchBase: classes.customSwitch,
													}}
												/>
											}
											label="Show Only Active Interns"
											labelPlacement="bottom"
											classes={{
												root: classes.switchLabel,
											}}
										/>
									</Grid>
									<Grid item xs={2}>
										<FormControlLabel
											control={
												<Switch
													checked={showOnlyMentees}
													onChange={() => search("", false, true)}
													color="secondary"
													classes={{
														switchBase: classes.customSwitch,
													}}
												/>
											}
											label="Show Only My Mentees"
											labelPlacement="bottom"
											classes={{
												root: classes.switchLabel,
											}}
										/>
									</Grid>
									<Grid item xs={8} container justify="flex-end" alignItems="center">
										<Paper className={classes.search} variant="outlined">
											<InputBase
												placeholder="Search by name"
												type="text"
												value={searchQuery}
												onChange={(e) => {
													setSearchQuery(e.target.value);
													search(e.target.value);
												}}
												fullWidth
											/>
											{searchQuery ? (
												<IconButton
													aria-label="search"
													edge="end"
													onClick={() => {
														setSearchQuery("");
														search("");
													}}
												>
													<Close />
												</IconButton>
											) : (
												<IconButton aria-label="search" edge="end">
													<Search />
												</IconButton>
											)}
										</Paper>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem className={classes.listHeader}>
								<Grid container spacing={2}>
									<Grid container item xs={2}>
										<IconButton
											aria-label="sort order"
											onClick={() => {
												setSortBy("name");
												if (!sorted["name"]) {
													sort("name", sortOrder["name"]);
												} else {
													sort("name", !sortOrder["name"]);
												}
											}}
											size="small"
											className={classes.sortButton}
										>
											<Sort
												style={{
													transform: sorted["name"]
														? !sortOrder["name"]
															? "scaleY(-1)"
															: "scaleY(1)"
														: "scaleY(-1)",
												}}
											/>
										</IconButton>
										<Typography variant="subtitle1">Name</Typography>
									</Grid>
									<Grid container item xs={2}>
										<IconButton
											aria-label="sort order"
											onClick={() => {
												setSortBy("blogs");
												if (!sorted["blogs"]) {
													sort("blogs", sortOrder["blogs"]);
												} else {
													sort("blogs", !sortOrder["blogs"]);
												}
											}}
											size="small"
											className={classes.sortButton}
										>
											<Sort
												style={{
													transform: sorted["blogs"]
														? !sortOrder["blogs"]
															? "scaleY(-1)"
															: "scaleY(1)"
														: "scaleY(-1)",
												}}
											/>
										</IconButton>
										<Typography variant="subtitle1">Blogs</Typography>
									</Grid>
									<Grid container item xs={2}>
										<IconButton
											aria-label="sort order"
											onClick={() => {
												setSortBy("gitIssues");
												if (!sorted["gitIssues"]) {
													sort("gitIssues", sortOrder["gitIssues"]);
												} else {
													sort("gitIssues", !sortOrder["gitIssues"]);
												}
											}}
											size="small"
											className={classes.sortButton}
										>
											<Sort
												style={{
													transform: sorted["gitIssues"]
														? !sortOrder["gitIssues"]
															? "scaleY(-1)"
															: "scaleY(1)"
														: "scaleY(-1)",
												}}
											/>
										</IconButton>
										<Typography variant="subtitle1">Git Issues</Typography>
									</Grid>
									<Grid container item xs={2}>
										<IconButton
											aria-label="sort order"
											onClick={() => {
												setSortBy("presentationsOrWebinars");
												if (!sorted["presentationsOrWebinars"]) {
													sort(
														"presentationsOrWebinars",
														sortOrder["presentationsOrWebinars"]
													);
												} else {
													sort(
														"presentationsOrWebinars",
														!sortOrder["presentationsOrWebinars"]
													);
												}
											}}
											size="small"
											className={classes.sortButton}
										>
											<Sort
												style={{
													transform: sorted["presentationsOrWebinars"]
														? !sortOrder["presentationsOrWebinars"]
															? "scaleY(-1)"
															: "scaleY(1)"
														: "scaleY(-1)",
												}}
											/>
										</IconButton>
										<Typography variant="subtitle1">Presentations</Typography>
									</Grid>
									<Grid container item xs={2}>
										<IconButton
											aria-label="sort order"
											onClick={() => {
												setSortBy("projectTasksCompletion");
												if (!sorted["projectTasksCompletion"]) {
													sort("projectTasksCompletion", sortOrder["projectTasksCompletion"]);
												} else {
													sort(
														"projectTasksCompletion",
														!sortOrder["projectTasksCompletion"]
													);
												}
											}}
											size="small"
											className={classes.sortButton}
										>
											<Sort
												style={{
													transform: sorted["projectTasksCompletion"]
														? !sortOrder["projectTasksCompletion"]
															? "scaleY(-1)"
															: "scaleY(1)"
														: "scaleY(-1)",
												}}
											/>
										</IconButton>
										<Typography variant="subtitle1">Tasks Completion</Typography>
									</Grid>
									<Grid container item xs={2}>
										<IconButton
											aria-label="sort order"
											onClick={() => {
												setSortBy("pullRequests");
												if (!sorted["pullRequests"]) {
													sort("pullRequests", sortOrder["pullRequests"]);
												} else {
													sort("pullRequests", !sortOrder["pullRequests"]);
												}
											}}
											size="small"
											className={classes.sortButton}
										>
											<Sort
												style={{
													transform: sorted["pullRequests"]
														? !sortOrder["pullRequests"]
															? "scaleY(-1)"
															: "scaleY(1)"
														: "scaleY(-1)",
												}}
											/>
										</IconButton>
										<Typography variant="subtitle1">Pull Requests</Typography>
									</Grid>
								</Grid>
							</ListItem>
							{isLoading ? (
								listSkeletons()
							) : interns?.length === 0 ? (
								<EmptyPlaceholder
									title="The are no interns to show here"
									subtitle="Why not add a new intern to show here?"
								/>
							) : filteredInterns?.length === 0 ? (
								<div>
									<NoResultPlaceholder title="No results found" subtitle="Try something else?" />
								</div>
							) : (
								paginatedInterns?.map((intern: Intern, index: number) => {
									return (
										<React.Fragment key={index}>
											<ListItem>
												<Grid container spacing={2}>
													<Grid container alignItems="center" item xs={2}>
														<Typography
															onMouseEnter={(
																event: React.MouseEvent<HTMLSpanElement, MouseEvent>
															) => {
																handlePopOverOpen(event, index);
															}}
															onMouseLeave={handlePopOverClose}
															onClick={() => {
																setShowInternProfile(true);
																handlePopOverClose();
																setSelectedIntern(
																	internInfo.find(
																		(currIntern) =>
																			currIntern.profile.Email_ID ===
																			intern.profile.Email_ID
																	)
																);
															}}
															color="primary"
															className={classes.linkText}
														>
															{intern.name}
														</Typography>
														<Popover
															open={popOverIndex === index}
															anchorEl={anchorEl}
															onClose={handlePopOverClose}
															disableRestoreFocus
															className={classes.popOver}
															classes={{
																paper: classes.paper,
															}}
															anchorOrigin={{
																vertical: "bottom",
																horizontal: "right",
															}}
															transformOrigin={{
																vertical: "top",
																horizontal: "left",
															}}
														>
															<List>
																<Typography variant="subtitle1">Contact</Typography>
																<ListItem>
																	<ListItemText
																		secondary="Email"
																		primary={intern.profile.Email_ID}
																	/>
																</ListItem>
																<ListItem>
																	<ListItemText
																		secondary="Contact No."
																		primary={intern.profile.Contact_no}
																	/>
																</ListItem>

																<Typography variant="subtitle1">Mentors</Typography>
																<ListItem>
																	<ListItemText
																		secondary="Mentor"
																		primary={intern.profile.Mentor}
																	/>
																</ListItem>
																<ListItem>
																	<ListItemText
																		secondary="Co-mentor"
																		primary={intern.profile.Co_mentor}
																	/>
																</ListItem>

																<Typography variant="subtitle1">
																	Internship Period
																</Typography>
																<ListItem>
																	<ListItemText
																		secondary="Joined Date"
																		primary={intern.profile.Joined_date}
																	/>
																</ListItem>
																<ListItem>
																	<ListItemText
																		secondary="Leaving Date"
																		primary={intern.profile.Leaving_date}
																	/>
																</ListItem>

																<Typography variant="subtitle1">From</Typography>
																<ListItem>
																	<ListItemText
																		secondary="University"
																		primary={intern.profile.University}
																	/>
																</ListItem>

																<Typography variant="subtitle1">Career</Typography>
																<ListItem>
																	<ListItemText
																		secondary="Project"
																		primary={
																			intern.projects instanceof Array &&
																			intern.projects
																				.map(
																					(project: Project) => project.Title
																				)
																				.join("\n")
																		}
																	/>
																</ListItem>
															</List>
														</Popover>
													</Grid>
													<Grid container alignItems="center" item xs={2}>
														<Typography>{intern.blogs}</Typography>
													</Grid>
													<Grid container alignItems="center" item xs={2}>
														<Typography>{intern.gitIssues}</Typography>
													</Grid>
													<Grid container alignItems="center" item xs={2}>
														<Typography>{intern.presentationsOrWebinars}</Typography>
													</Grid>
													<Grid container alignItems="center" item xs={2}>
														<Typography>{intern.projectTasksCompletion * 100}%</Typography>
													</Grid>
													<Grid container alignItems="center" item xs={2}>
														<Typography>{intern.pullRequests}</Typography>
													</Grid>
												</Grid>
											</ListItem>
											{paginatedInterns.length - 1 !== index && <Divider />}
										</React.Fragment>
									);
								})
							)}
							{!isLoading && filteredInterns.length > 10 && (
								<Pagination
									count={Math.ceil(filteredInterns.length / itemsPerPage)}
									page={page}
									onChange={handlePageChange}
									showFirstButton
									showLastButton
									color="primary"
									className={classes.pagination}
								/>
							)}
						</List>
					</Paper>
				</>
			)}
		</>
	);
};
