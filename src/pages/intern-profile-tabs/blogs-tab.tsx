import { Blog } from "../../models";
import React, { ReactElement, useState, useEffect, ChangeEvent } from "react";
import { Grid, List, ListItem, Link, Divider, IconButton, Paper, Typography, InputBase } from "@material-ui/core";
import { Close, Sort, Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import useStyles from "../../theme";
import { NoResultPlaceholder, EmptyPlaceholder } from "../../components";

interface BlogsTabPropsInterface {
	blogs: Blog[];
}

const SORT_BY: {
	key: keyof Blog;
	text: string;
}[] = [
	{
		key: "Title",
		text: "Title",
	},
];

export const BlogsTab = (props: BlogsTabPropsInterface): ReactElement => {
	const { blogs } = props;

	const [paginatedBlogs, setPaginatedBlogs] = useState<Blog[]>([]);
	const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState(false);

	const itemsPerPage = 10;

	const classes = useStyles();

	useEffect(() => {
		const filteredIssues = blogs.filter((issue: Blog) => {
			return issue.Title.toLowerCase().includes(searchQuery.toLowerCase());
		});

		let issuesToPaginate;

		if (sorted) {
			let sortedArray = [...filteredIssues].sort((a: Blog, b: Blog) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();

			issuesToPaginate = [...sortedArray];
		} else {
			issuesToPaginate = [...filteredIssues];
		}

		setFilteredBlogs(issuesToPaginate);

		let currentPage = page;

		if (issuesToPaginate.length !== 0 && Math.ceil(issuesToPaginate.length / itemsPerPage) < page) {
			currentPage = Math.ceil(issuesToPaginate.length / itemsPerPage);
			setPage(currentPage);
		}

		const paginateIssues = issuesToPaginate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
		setPaginatedBlogs(paginateIssues);
	}, [searchQuery, sortOrder, sorted, sortBy, page, blogs]);

	const sort = (sortBy: keyof Blog, order?: boolean) => {
		let sortedArray = [...filteredBlogs].sort((a: Blog, b: Blog) => {
			if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
			else return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredBlogs(sortedArray);
		setPaginatedBlogs(sortedArray.slice(0, itemsPerPage));
		setPage(1);
		sorted && setSortOrder(order);
		setSorted(true);
	};

	const search = (search: string) => {
		const filteredIssues = blogs.filter((issue: Blog) => {
			return issue.Title.toLowerCase().includes(search.toLowerCase());
		});

		let sortedArray = [...filteredIssues];
		if (sorted) {
			sortedArray = [...filteredIssues].sort((a: Blog, b: Blog) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
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
			<List className={classes.list}>
				<ListItem className={classes.listHeader}>
					<Grid container spacing={2} className={classes.filterGrid}>
						<Grid item xs={12} container justify="flex-end">
							<Paper className={classes.search} variant="outlined">
								<InputBase
									placeholder="Search by blog title"
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
									setSortBy("Title");
									if (!sorted) {
										sort("Title", sortOrder);
									} else {
										sort("Title", !sortOrder);
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
							<Typography variant="subtitle1">Blog Title</Typography>
						</Grid>
					</Grid>
				</ListItem>
				{blogs?.length === 0 ? (
					<EmptyPlaceholder
						title="The are no blogs to show here"
						subtitle=""
					/>
				) : filteredBlogs?.length === 0 ? (
					<div>
						<NoResultPlaceholder title="No results found" subtitle="Try something else?" />
					</div>
				) : (
					paginatedBlogs?.map((gitIssue: Blog, index: number) => {
						return (
							<React.Fragment key={index}>
								<ListItem>
									<Grid container spacing={2}>
										<Grid container alignItems="center" item xs={12}>
											<Link target="_blank" href={gitIssue.Link} className={classes.noButtonList}>
												<Typography>{gitIssue.Title}</Typography>
											</Link>
										</Grid>
									</Grid>
								</ListItem>
								{paginatedBlogs.length - 1 !== index && <Divider />}
							</React.Fragment>
						);
					})
				)}
				{filteredBlogs.length > 10 && (
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
