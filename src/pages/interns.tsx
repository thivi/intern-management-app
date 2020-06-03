import React, { ReactElement, useState, useContext, useCallback, useEffect, ChangeEvent, useRef } from "react";
import {
	Grid,
	List,
	ListItem,
	Divider,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	OutlinedInput,
	Typography,
	Popover,
	ListItemText,
	FormControlLabel,
	Switch,
} from "@material-ui/core";
import { Intern, Profile, PullRequest, GitIssue, PresentationOrWebinar, ProjectTask } from "../models";
import { getBlogs, getProfile, getIssues, getPullRequests, getPresentationsOrWebinars, getProjectTasks } from "../apis";
import { AuthContext } from "../helpers";
import { Close, Sort, Search } from "@material-ui/icons";
import { Skeleton, Pagination } from "@material-ui/lab";
import useStyles from "../theme";

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

interface InternInfo {
	profile: Profile;
	blogs: Intern[];
	gitIssues: GitIssue[];
	pullRequests: PullRequest[];
	presentationsOrWebinars: PresentationOrWebinar[];
	projectTasks: ProjectTask[];
}

export const Interns = (): ReactElement => {
	const [paginatedInterns, setPaginatedInterns] = useState<Intern[]>([]);
	const [filteredInterns, setFilteredInterns] = useState<Intern[]>([]);
	const { authState } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState(false);
	const [internInfo, setInternInfo] = useState<InternInfo[]>([]);
	const [interns, setInterns] = useState<Intern[]>([]);
	const [popOverIndex, setPopOverIndex] = useState(-1);
	const [anchorEl, setAnchorEl] = useState(null);
	const [showOnlyMentees, setShowOnlyMentees] = useState(false);
	const [showOnlyActive, setShowOnlyActive] = useState(false);

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

	const getInternsCall = useCallback(() => {
		setIsLoading(true);
		const profile = getProfile();
		const blogs = getBlogs();
		const gitInterns = getIssues();
		const pullRequests = getPullRequests();
		const presentationsOrWebinars = getPresentationsOrWebinars();
		const projectTasks = getProjectTasks();

		Promise.all([profile, blogs, gitInterns, pullRequests, presentationsOrWebinars, projectTasks])
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

					const internBlogs: Intern[] = blogs.map((blog: string[]) => ({
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
						Email_ID: pullRequests[0],
						Title: pullRequests[1],
						Link: pullRequests[2],
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

				if (sorted) {
					let sortedArray = [...filteredInterns].sort((a: Intern, b: Intern) => {
						if (sortBy === "name" || sortBy === "email") {
							if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
							else return -1;
						} else if (sortBy !== "profile") {
							if (a[sortBy] - b[sortBy]) return 1;
							else return -1;
						}
						return -1;
					});

					if (!sortOrder) sortedArray = sortedArray.reverse();

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
				//TODO: Notify
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [searchQuery, sortOrder, sorted, sortBy, page, isActive, isMentee, showOnlyMentees, showOnlyActive]);

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
							<Skeleton variant="text" />
						</Grid>
					</Grid>
				</ListItem>
			);
		}

		return <List>{skeletons}</List>;
	};

	const sort = (sortBy: keyof Intern, order?: boolean) => {
		setSorted(true);
		let sortedArray = [...filteredInterns].sort((a: Intern, b: Intern) => {
			if (sortBy === "name" || sortBy === "email") {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			} else if (sortBy !== "profile") {
				if (a[sortBy] - b[sortBy]) return 1;
				else return -1;
			}

			return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredInterns(sortedArray);
		setPaginatedInterns(sortedArray.slice(0, itemsPerPage));
		setPage(1);
		setSortOrder(order);
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
				} else if (sortBy !== "profile") {
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
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<FormControl variant="outlined">
						<InputLabel>Sort By</InputLabel>
						<Select
							value={sortBy}
							onChange={(event) => {
								setSortBy(event.target.value as keyof Intern);
								sort(event.target.value as keyof Intern);
							}}
							label="Sort By"
						>
							{SORT_BY.map((option, index: number) => {
								return (
									<MenuItem key={index} value={option.key}>
										{option.text}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
					<IconButton
						aria-label="sort order"
						onClick={() => {
							sort(sortBy, !sortOrder);
						}}
					>
						<Sort style={{ transform: sortOrder ? "scaleY(-1)" : "scaleY(1)" }} />
					</IconButton>
				</Grid>
				<Grid item xs={9} container justify="flex-end">
					<FormControlLabel
						control={
							<Switch checked={showOnlyActive} onChange={() => search("", true, false)} color="primary" />
						}
						label="Show Only Active Interns"
						labelPlacement="start"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={showOnlyMentees}
								onChange={() => search("", false, true)}
								color="primary"
							/>
						}
						label="Show only me mentees"
						labelPlacement="start"
					/>
					<FormControl variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
						<OutlinedInput
							type="text"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								search(e.target.value);
							}}
							endAdornment={
								<InputAdornment position="end">
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
								</InputAdornment>
							}
							labelWidth={70}
						/>
					</FormControl>
				</Grid>
			</Grid>
			<List>
				{isLoading
					? listSkeletons()
					: paginatedInterns?.map((intern: Intern, index: number) => {
							return (
								<React.Fragment key={index}>
									<ListItem>
										<Grid container spacing={2}>
											<Grid container alignItems="center" item xs={4}>
												<Typography
													onMouseEnter={(
														event: React.MouseEvent<HTMLSpanElement, MouseEvent>
													) => {
														handlePopOverOpen(event, index);
													}}
													onMouseLeave={handlePopOverClose}
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
														horizontal: "left",
													}}
													transformOrigin={{
														vertical: "top",
														horizontal: "left",
													}}
												>
													<List>
														<ListItem>
															<ListItemText
																secondary="Mentor"
																primary={internInfo[index].profile.Mentor}
															/>
														</ListItem>
														<ListItem>
															<ListItemText
																secondary="Co-mentor"
																primary={intern.profile.Co_mentor}
															/>
														</ListItem>
														<ListItem>
															<ListItemText
																secondary="Contact No."
																primary={intern.profile.Contact_no}
															/>
														</ListItem>
														<ListItem>
															<ListItemText
																secondary="University"
																primary={intern.profile.University}
															/>
														</ListItem>
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
													</List>
												</Popover>
											</Grid>
											<Grid container alignItems="center" item xs={3}>
												{intern.email}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{intern.blogs}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{intern.gitIssues}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{intern.presentationsOrWebinars}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{intern.projectTasksCompletion}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{intern.pullRequests}
											</Grid>
										</Grid>
									</ListItem>
									{paginatedInterns.length - 1 !== index && <Divider />}
								</React.Fragment>
							);
					  })}
				{!isLoading && interns.length > 10 && (
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
		</>
	);
};
