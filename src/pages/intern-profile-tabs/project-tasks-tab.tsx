import React, { ReactElement, useState, useEffect, ChangeEvent } from "react";
import {
	Grid,
	List,
	ListItem,
	Divider,
	IconButton,
	Paper,
	InputBase,
	Typography,
	FormControlLabel,
	Checkbox,
	Switch,
} from "@material-ui/core";
import { ProjectTask } from "../../models";
import { Close, Sort, Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import useStyles from "../../theme";
import { EmptyPlaceholder, NoResultPlaceholder } from "../../components";

const SORT_BY: {
	key: keyof ProjectTask;
	text: string;
}[] = [
	{
		key: "Title",
		text: "Title",
	},
	{
		key: "PullRequest",
		text: "PullRequest",
	},
];

interface Sort {
	Title: boolean;
	PullRequest: boolean;
	[key: string]: boolean;
}

interface ProjectTasksTabPropsInterface {
	projectTasks: ProjectTask[];
}

export const ProjectTasksTab = (props: ProjectTasksTabPropsInterface): ReactElement => {
	const { projectTasks } = props;

	const [paginatedProjectTasks, setPaginatedProjectTasks] = useState<ProjectTask[]>([]);
	const [filteredProjectTasks, setFilteredProjectTasks] = useState<ProjectTask[]>([]);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState<Sort>({ Title: true, PullRequest: true });
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState<Sort>({ Title: false, PullRequest: false });
	const [hideCompleted, setHideCompleted] = useState(false);

	const itemsPerPage = 10;

	const classes = useStyles();

	useEffect(() => {
		const filteredIssues = projectTasks.filter((issue: ProjectTask) => {
			const query = searchQuery.toLowerCase();
			const matchesQuery = issue.Title.toLowerCase().includes(query);
			const show = hideCompleted ? issue.Completed === "no" : true;
			return matchesQuery && show;
		});

		let issuesToPaginate;

		if (sorted[sortBy]) {
			let sortedArray = [...filteredIssues].sort((a: ProjectTask, b: ProjectTask) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder[sortBy]) sortedArray = sortedArray.reverse();

			issuesToPaginate = [...sortedArray];
		} else {
			issuesToPaginate = [...filteredIssues];
		}

		setFilteredProjectTasks(issuesToPaginate);

		let currentPage = page;

		if (issuesToPaginate.length !== 0 && Math.ceil(issuesToPaginate.length / itemsPerPage) < page) {
			currentPage = Math.ceil(issuesToPaginate.length / itemsPerPage);
			setPage(currentPage);
		}

		const paginateIssues = issuesToPaginate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
		setPaginatedProjectTasks(paginateIssues);
	}, [projectTasks, searchQuery, sortOrder, sorted, sortBy, page, hideCompleted]);

	const sort = (sortBy: keyof ProjectTask, order?: boolean) => {
		let sortedArray = [...filteredProjectTasks].sort((a: ProjectTask, b: ProjectTask) => {
			if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
			else return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredProjectTasks(sortedArray);
		setPaginatedProjectTasks(sortedArray.slice(0, itemsPerPage));
		setPage(1);

		const tempSortOrder: Sort = { ...sortOrder };
		tempSortOrder[sortBy] = order;
		sorted[sortBy] && setSortOrder(tempSortOrder);
		const tempSorted: Sort = { ...sorted };
		tempSorted[sortBy] = true;
		setSorted(tempSorted);
	};

	const search = (search: string, hide?: boolean) => {
		const filteredIssues = projectTasks.filter((issue: ProjectTask) => {
			const query = hide ? searchQuery.toLowerCase() : search.toLowerCase();
			const matchesQuery = issue.Title.toLowerCase().includes(query);
			const show = (hide && !hideCompleted) || (!hide && hideCompleted) ? issue.Completed === "no" : true;
			return matchesQuery && show;
		});

		if (hide) {
			setHideCompleted(!hideCompleted);
		}

		let sortedArray = [...filteredIssues];
		if (sorted) {
			sortedArray = [...filteredIssues].sort((a: ProjectTask, b: ProjectTask) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();
		}

		setFilteredProjectTasks(sortedArray);
		setPaginatedProjectTasks(sortedArray.slice(0, itemsPerPage));
		setPage(1);
	};

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedProjectTasks(filteredProjectTasks.slice((value - 1) * itemsPerPage, value * itemsPerPage));
	};

	return (
		<>
			<List className={classes.list}>
				<ListItem className={classes.listHeader}>
					<Grid container spacing={2} className={classes.filterGrid}>
						<Grid item xs={2}>
							<FormControlLabel
								control={
									<Switch
										checked={hideCompleted}
										onChange={() => search("", true)}
										color="secondary"
									/>
								}
								label="Hide Completed"
								labelPlacement="top"
							/>
						</Grid>
						<Grid item xs={10} container justify="flex-end" alignItems="center">
							<Paper className={classes.search} variant="outlined">
								<InputBase
									placeholder="Search by project task name"
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
						<Grid container item xs={7}>
							<IconButton
								aria-label="sort order"
								onClick={() => {
									setSortBy("Title");
									if (!sorted["Title"]) {
										sort("Title", sortOrder["Title"]);
									} else {
										sort("Title", !sortOrder["Title"]);
									}
								}}
								size="small"
								className={classes.sortButton}
							>
								<Sort
									style={{
										transform: sorted["Title"]
											? !sortOrder["Title"]
												? "scaleY(-1)"
												: "scaleY(1)"
											: "scaleY(-1)",
									}}
								/>
							</IconButton>
							<Typography variant="subtitle1">Task Name</Typography>
						</Grid>
						<Grid container item xs={5}>
							<IconButton
								aria-label="sort order"
								onClick={() => {
									setSortBy("PullRequest");
									if (!sorted["PullRequest"]) {
										sort("PullRequest", sortOrder["PullRequest"]);
									} else {
										sort("PullRequest", !sortOrder["PullRequest"]);
									}
								}}
								size="small"
								className={classes.sortButton}
							>
								<Sort
									style={{
										transform: sorted["PullRequest"]
											? !sortOrder["PullRequest"]
												? "scaleY(-1)"
												: "scaleY(1)"
											: "scaleY(-1)",
									}}
								/>
							</IconButton>
							<Typography variant="subtitle1">Pull Request</Typography>
						</Grid>
					</Grid>
				</ListItem>
				{projectTasks?.length === 0 ? (
					<EmptyPlaceholder
						title="The are no project tasks to show here"
						subtitle="Why not add a new project task to show here?"
					/>
				) : filteredProjectTasks?.length === 0 ? (
					<div>
						<NoResultPlaceholder title="No results found" subtitle="Try something else?" />
					</div>
				) : (
					paginatedProjectTasks?.map((gitIssue: ProjectTask, index: number) => {
						return (
							<React.Fragment key={index}>
								<ListItem>
									<Grid container spacing={2}>
										<Grid item xs={1}>
											<FormControlLabel
												control={
													<Checkbox
														checked={gitIssue.Completed === "yes"}
														name="completed"
														disabled
													/>
												}
												label=""
											/>
										</Grid>
										<Grid container alignItems="center" item xs={6}>
											<Typography component="h4">{gitIssue.Title}</Typography>
										</Grid>
										<Grid container alignItems="center" item xs={5}>
											<Typography component="h4">{gitIssue.PullRequest}</Typography>
										</Grid>
									</Grid>
								</ListItem>
								{paginatedProjectTasks.length - 1 !== index && <Divider />}
							</React.Fragment>
						);
					})
				)}
				{filteredProjectTasks.length > 10 && (
					<Pagination
						count={Math.ceil(filteredProjectTasks.length / itemsPerPage)}
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
