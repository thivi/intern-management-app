import React, { ReactElement, useState, useEffect, ChangeEvent } from "react";
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
	FormControlLabel,
	Checkbox,
	Switch,
} from "@material-ui/core";
import { ProjectTask } from "../../models";
import { Close, Sort, Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import useStyles from "../../theme";

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
	const [sortOrder, setSortOrder] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState(false);
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

		if (sorted) {
			let sortedArray = [...filteredIssues].sort((a: ProjectTask, b: ProjectTask) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();

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
		sorted && setSortOrder(order);
		setSorted(true);
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
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<FormControl variant="outlined">
						<InputLabel>Sort By</InputLabel>
						<Select
							value={sortBy}
							onChange={(event) => {
								setSortBy(event.target.value as keyof ProjectTask);
								sort(event.target.value as keyof ProjectTask);
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
							if (!sorted) {
								sort(sortBy, sortOrder);
							} else {
								sort(sortBy, !sortOrder);
							}
						}}
					>
						<Sort
							style={{ transform: sorted ? (!sortOrder ? "scaleY(-1)" : "scaleY(1)") : "scaleY(-1)" }}
						/>
					</IconButton>
				</Grid>
				<Grid item xs={9} container justify="flex-end">
					<FormControlLabel
						control={<Switch checked={hideCompleted} onChange={() => search("", true)} color="primary" />}
						label="Hide Completed"
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
											aria-label="close"
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
				{paginatedProjectTasks?.map((gitIssue: ProjectTask, index: number) => {
					return (
						<React.Fragment key={index}>
							<ListItem>
								<Grid container spacing={2}>
									<>
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
									</>
								</Grid>
							</ListItem>
							{paginatedProjectTasks.length - 1 !== index && <Divider />}
						</React.Fragment>
					);
				})}
				{projectTasks.length > 10 && (
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
