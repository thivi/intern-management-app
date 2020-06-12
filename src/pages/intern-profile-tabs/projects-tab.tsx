import React, { ReactElement, useState, useEffect, ChangeEvent } from "react";
import { Grid, List, ListItem, Divider, IconButton, Paper, InputBase, Typography } from "@material-ui/core";
import { Project } from "../../models";
import { Close, Sort, Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import useStyles from "../../theme";
import { EmptyPlaceholder, NoResultPlaceholder } from "../../components";

const SORT_BY: {
	key: keyof Project;
	text: string;
}[] = [
	{
		key: "Title",
		text: "Title",
	},
	{
		key: "Mentor",
		text: "Mentor",
	},
];

interface Sort {
	Title: boolean;
	Mentor: boolean;
	[key: string]: boolean;
}

interface ProjectsTabPropsInterface {
	projects: Project[];
}
export const ProjectsTab = (props: ProjectsTabPropsInterface): ReactElement => {
	const { projects } = props;
	const [paginatedProjects, setPaginatedProjects] = useState<Project[]>([]);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState<Sort>({ Title: true, Mentor: true });
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState<Sort>({ Title: false, Mentor: false });

	const itemsPerPage = 10;

	const classes = useStyles();

	useEffect(() => {
		const filteredIssues = projects.filter((issue: Project) => {
			return issue.Title.toLowerCase().includes(searchQuery.toLowerCase());
		});

		let issuesToPaginate;

		if (sorted[sortBy]) {
			let sortedArray = [...filteredIssues].sort((a: Project, b: Project) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder[sortBy]) sortedArray = sortedArray.reverse();

			issuesToPaginate = [...sortedArray];
		} else {
			issuesToPaginate = [...filteredIssues];
		}

		setFilteredProjects(issuesToPaginate);

		let currentPage = page;

		if (issuesToPaginate.length !== 0 && Math.ceil(issuesToPaginate.length / itemsPerPage) < page) {
			currentPage = Math.ceil(issuesToPaginate.length / itemsPerPage);
			setPage(currentPage);
		}

		const paginateIssues = issuesToPaginate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
		setPaginatedProjects(paginateIssues);
	}, [projects, searchQuery, sortOrder, sorted, sortBy, page]);

	const sort = (sortBy: keyof Project, order?: boolean) => {
		let sortedArray = [...filteredProjects].sort((a: Project, b: Project) => {
			if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
			else return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredProjects(sortedArray);
		setPaginatedProjects(sortedArray.slice(0, itemsPerPage));
		setPage(1);

		const tempSortOrder: Sort = { ...sortOrder };
		tempSortOrder[sortBy] = order;
		sorted[sortBy] && setSortOrder(tempSortOrder);
		const tempSorted: Sort = { ...sorted };
		tempSorted[sortBy] = true;
		setSorted(tempSorted);
	};

	const search = (search: string) => {
		const filteredIssues = projects.filter((issue: Project) => {
			return issue.Title.toLowerCase().includes(search.toLowerCase());
		});

		let sortedArray = [...filteredIssues];
		if (sorted) {
			sortedArray = [...filteredIssues].sort((a: Project, b: Project) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();
		}

		setFilteredProjects(sortedArray);
		setPaginatedProjects(sortedArray.slice(0, itemsPerPage));
		setPage(1);
	};

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedProjects(filteredProjects.slice((value - 1) * itemsPerPage, value * itemsPerPage));
	};

	return (
		<>
			<List className={classes.list}>
				<ListItem className={classes.listHeader}>
					<Grid container spacing={2} className={classes.filterGrid}>
						<Grid item xs={12} container justify="flex-end">
							<Paper className={classes.search} variant="outlined">
								<InputBase
									placeholder="Search by project name"
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
						<Grid container item xs={6}>
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
							<Typography variant="subtitle1">Project Name</Typography>
						</Grid>
						<Grid container item xs={6}>
							<IconButton
								aria-label="sort order"
								onClick={() => {
									setSortBy("Mentor");
									if (!sorted["Mentor"]) {
										sort("Mentor", sortOrder["Mentor"]);
									} else {
										sort("Mentor", !sortOrder["Mentor"]);
									}
								}}
								size="small"
								className={classes.sortButton}
							>
								<Sort
									style={{
										transform: sorted["Mentor"]
											? !sortOrder["Mentor"]
												? "scaleY(-1)"
												: "scaleY(1)"
											: "scaleY(-1)",
									}}
								/>
							</IconButton>
							<Typography variant="subtitle1">Mentor</Typography>
						</Grid>
					</Grid>
				</ListItem>
				{projects?.length === 0 ? (
					<EmptyPlaceholder
						title="The are no projects to show here"
						subtitle="Why not add a new project to show here?"
					/>
				) : filteredProjects?.length === 0 ? (
					<div>
						<NoResultPlaceholder title="No results found" subtitle="Try something else?" />
					</div>
				) : (
					paginatedProjects?.map((gitIssue: Project, index: number) => {
						return (
							<React.Fragment key={index}>
								<ListItem>
									<Grid container spacing={2}>
										<Grid container alignItems="center" item xs={6}>
											<Typography component="h4" className={classes.noButtonList}>
												{gitIssue.Title}
											</Typography>
										</Grid>
										<Grid container alignItems="center" item xs={6}>
											<Typography component="h4">{gitIssue.Mentor}</Typography>
										</Grid>
									</Grid>
								</ListItem>
								{paginatedProjects.length - 1 !== index && <Divider />}
							</React.Fragment>
						);
					})
				)}
				{filteredProjects.length > 10 && (
					<Pagination
						count={Math.ceil(filteredProjects.length / itemsPerPage)}
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
