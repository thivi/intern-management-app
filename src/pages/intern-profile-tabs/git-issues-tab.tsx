import React, { ReactElement, useState, ChangeEvent, useEffect } from "react";
import { Grid, List, ListItem, Link, Divider, IconButton, Typography, Paper, InputBase } from "@material-ui/core";
import { GitIssue } from "../../models";
import { Close, Sort, Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import useStyles from "../../theme";
import { NoResultPlaceholder, EmptyPlaceholder } from "../../components";

const SORT_BY: {
	key: keyof GitIssue;
	text: string;
}[] = [
	{
		key: "Issue_Title",
		text: "Issue Title",
	},
];

interface GitIssuesTabPropsInterface {
	gitIssues: GitIssue[];
}

export const GitIssuesTab = (props: GitIssuesTabPropsInterface): ReactElement => {
	const { gitIssues } = props;
	const [paginatedGitIssues, setPaginatedGitIssues] = useState<GitIssue[]>([]);
	const [filteredGitIssues, setFilteredGitIssues] = useState<GitIssue[]>([]);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState(false);

	const itemsPerPage = 10;

	const classes = useStyles();

	useEffect(() => {
		const filteredIssues = gitIssues.filter((issue: GitIssue) => {
			return issue.Issue_Title.toLowerCase().includes(searchQuery.toLowerCase());
		});

		let issuesToPaginate;

		if (sorted) {
			let sortedArray = [...filteredIssues].sort((a: GitIssue, b: GitIssue) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();

			issuesToPaginate = [...sortedArray];
		} else {
			issuesToPaginate = [...filteredIssues];
		}

		setFilteredGitIssues(issuesToPaginate);

		let currentPage = page;

		if (issuesToPaginate.length !== 0 && Math.ceil(issuesToPaginate.length / itemsPerPage) < page) {
			currentPage = Math.ceil(issuesToPaginate.length / itemsPerPage);
			setPage(currentPage);
		}

		const paginateIssues = issuesToPaginate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
		setPaginatedGitIssues(paginateIssues);
	}, [gitIssues, page, searchQuery, sortBy, sortOrder, sorted]);

	const sort = (sortBy: keyof GitIssue, order?: boolean) => {
		let sortedArray = [...filteredGitIssues].sort((a: GitIssue, b: GitIssue) => {
			if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
			else return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredGitIssues(sortedArray);
		setPaginatedGitIssues(sortedArray.slice(0, itemsPerPage));
		setPage(1);
		sorted && setSortOrder(order);
		setSorted(true);
	};

	const search = (search: string) => {
		const filteredIssues = gitIssues.filter((issue: GitIssue) => {
			return issue.Issue_Title.toLowerCase().includes(search.toLowerCase());
		});

		let sortedArray = [...filteredIssues];
		if (sorted) {
			sortedArray = [...filteredIssues].sort((a: GitIssue, b: GitIssue) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();
		}

		setFilteredGitIssues(sortedArray);
		setPaginatedGitIssues(sortedArray.slice(0, itemsPerPage));
		setPage(1);
	};

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedGitIssues(filteredGitIssues.slice((value - 1) * itemsPerPage, value * itemsPerPage));
	};

	return (
		<>
			<List className={classes.list}>
				<ListItem className={classes.listHeader}>
					<Grid container spacing={2} className={classes.filterGrid}>
						<Grid item xs={12} container justify="flex-end">
							<Paper className={classes.search} variant="outlined">
								<InputBase
									placeholder="Search by issue title"
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
						<Grid container item xs={12}>
							<IconButton
								aria-label="sort order"
								onClick={() => {
									setSortBy("Issue_Title");
									if (!sorted) {
										sort("Issue_Title", sortOrder);
									} else {
										sort("Issue_Title", !sortOrder);
									}
								}}
								size="small"
								className={classes.sortButton}
							>
								<Sort
									style={{
										transform: sorted ? (!sortOrder ? "scaleY(-1)" : "scaleY(1)") : "scaleY(-1)",
									}}
								/>
							</IconButton>
							<Typography variant="subtitle1">Git Issue Title</Typography>
						</Grid>
					</Grid>
				</ListItem>
				{gitIssues?.length === 0 ? (
					<EmptyPlaceholder
						title="The are no git issues to show here"
						subtitle=""
					/>
				) : filteredGitIssues?.length === 0 ? (
					<div>
						<NoResultPlaceholder title="No results found" subtitle="Try something else?" />
					</div>
				) : (
					paginatedGitIssues?.map((gitIssue: GitIssue, index: number) => {
						return (
							<React.Fragment key={index}>
								<ListItem>
									<Grid container spacing={2}>
										<Grid container alignItems="center" item xs={12}>
											<Link target="_blank" href={gitIssue.Link} className={classes.noButtonList}>
												<Typography>{gitIssue.Issue_Title}</Typography>
											</Link>
										</Grid>
									</Grid>
								</ListItem>
								{paginatedGitIssues.length - 1 !== index && <Divider />}
							</React.Fragment>
						);
					})
				)}
				{filteredGitIssues.length > 10 && (
					<Pagination
						count={Math.ceil(filteredGitIssues.length / itemsPerPage)}
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
