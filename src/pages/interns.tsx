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
	const [paginatedBlogs, setPaginatedBlogs] = useState<Intern[]>([]);
	const [filteredBlogs, setFilteredBlogs] = useState<Intern[]>([]);
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

	const itemsPerPage = 10;

	const classes = useStyles();

	const init = useRef(true);

	const getBlogsCall = useCallback(() => {
		setIsLoading(true);
		const profile = getProfile();
		const blogs = getBlogs();
		const gitIssues = getIssues();
		const pullRequests = getPullRequests();
		const presentationsOrWebinars = getPresentationsOrWebinars();
		const projectTasks = getProjectTasks();

		Promise.all([profile, blogs, gitIssues, pullRequests, presentationsOrWebinars, projectTasks])
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

					internInfo.push({
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

				const filteredIssues = internsList.filter((intern: Intern) => {
					return intern.name.toLowerCase().includes(searchQuery.toLowerCase());
				});

				let internsToPaginate;

				if (sorted) {
					let sortedArray = [...filteredIssues].sort((a: Intern, b: Intern) => {
						if (sortBy === "name" || sortBy === "email")
							if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
							else return -1;
						else if (a[sortBy] - b[sortBy]) return 1;
						else return -1;
					});

					if (!sortOrder) sortedArray = sortedArray.reverse();

					internsToPaginate = [...sortedArray];
				} else {
					internsToPaginate = [...filteredIssues];
				}

				setFilteredBlogs(internsToPaginate);

				let currentPage = page;

				if (internsToPaginate.length !== 0 && Math.ceil(internsToPaginate.length / itemsPerPage) < page) {
					currentPage = Math.ceil(internsToPaginate.length / itemsPerPage);
					setPage(currentPage);
				}

				const paginateIssues = internsToPaginate.slice(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage
				);
				setPaginatedBlogs(paginateIssues);
			})
			.catch((error) => {
				//TODO: Notify
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [searchQuery, sortOrder, sorted, sortBy, page, internInfo]);

	useEffect(() => {
		if (init.current && getBlogsCall && authState.authData) {
			getBlogsCall();
			init.current = false;
		}
	}, [getBlogsCall, authState.authData]);

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

	const sort = (sortBy: keyof Intern, sortOrder?: boolean) => {
		setSorted(true);
		let sortedArray = [...filteredBlogs].sort((a: Intern, b: Intern) => {
			if (sortBy === "name" || sortBy === "email")
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			else if (a[sortBy] - b[sortBy]) return 1;
			else return -1;
		});

		if (!sortOrder) sortedArray = sortedArray.reverse();

		setFilteredBlogs(sortedArray);
		setPaginatedBlogs(sortedArray.slice(0, itemsPerPage));
		setPage(1);
		setSortOrder(sortOrder);
	};

	const search = (search: string) => {
		const filteredIssues = interns.filter((issue: Intern) => {
			return issue.name.toLowerCase().includes(search.toLowerCase());
		});

		let sortedArray = [...filteredIssues];
		if (sorted) {
			sortedArray = [...filteredIssues].sort((a: Intern, b: Intern) => {
				if (sortBy === "name" || sortBy === "email")
					if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
					else return -1;
				else if (a[sortBy] - b[sortBy]) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();
		}

		setFilteredBlogs(sortedArray);
		setPaginatedBlogs(sortedArray.slice(0, itemsPerPage));
		setPage(1);
	};

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedBlogs(filteredBlogs.slice((value - 1) * itemsPerPage, value * itemsPerPage));
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
					: paginatedBlogs?.map((gitIssue: Intern, index: number) => {
							return (
								<React.Fragment key={index}>
									<ListItem>
										<Grid container spacing={2}>
											<Grid container alignItems="center" item xs={4}>
												{gitIssue.name}
											</Grid>
											<Grid container alignItems="center" item xs={3}>
												{gitIssue.email}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{gitIssue.blogs}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{gitIssue.gitIssues}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{gitIssue.presentationsOrWebinars}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{gitIssue.projectTasksCompletion}
											</Grid>
											<Grid container alignItems="center" item xs={1}>
												{gitIssue.pullRequests}
											</Grid>
										</Grid>
									</ListItem>
									{paginatedBlogs.length - 1 !== index && <Divider />}
								</React.Fragment>
							);
					  })}
				{!isLoading && interns.length > 10 && (
					<Pagination
						count={Math.ceil(filteredBlogs.length / itemsPerPage)}
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
