import React, { ReactElement, useState, useEffect, ChangeEvent } from "react";
import {
	Grid,
	List,
	ListItem,
	Link,
	Divider,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	OutlinedInput,
} from "@material-ui/core";
import { PullRequest } from "../../models";
import { Close, Sort, Search } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import useStyles from "../../theme";

const SORT_BY: {
	key: keyof PullRequest;
	text: string;
}[] = [
	{
		key: "Title",
		text: "Title",
	},
];

interface PullRequestsTabPropsInterface {
	pullRequests: PullRequest[];
}

export const PullRequestsTab = (props: PullRequestsTabPropsInterface): ReactElement => {
	const { pullRequests } = props;
	const [paginatedPullRequests, setPaginatedPullRequests] = useState<PullRequest[]>([]);
	const [filteredPullRequests, setFilteredPullRequests] = useState<PullRequest[]>([]);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [sorted, setSorted] = useState(false);

	const itemsPerPage = 10;

	const classes = useStyles();

	useEffect(() => {
		const filteredIssues = pullRequests.filter((issue: PullRequest) => {
			return issue.Title.toLowerCase().includes(searchQuery.toLowerCase());
		});

		let issuesToPaginate;

		if (sorted) {
			let sortedArray = [...filteredIssues].sort((a: PullRequest, b: PullRequest) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();

			issuesToPaginate = [...sortedArray];
		} else {
			issuesToPaginate = [...filteredIssues];
		}

		setFilteredPullRequests(issuesToPaginate);

		let currentPage = page;

		if (issuesToPaginate.length !== 0 && Math.ceil(issuesToPaginate.length / itemsPerPage) < page) {
			currentPage = Math.ceil(issuesToPaginate.length / itemsPerPage);
			setPage(currentPage);
		}

		const paginateIssues = issuesToPaginate.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
		setPaginatedPullRequests(paginateIssues);
	}, [pullRequests, searchQuery, sortOrder, sorted, sortBy, page]);

	const sort = (sortBy: keyof PullRequest, order?: boolean) => {
		let sortedArray = [...filteredPullRequests].sort((a: PullRequest, b: PullRequest) => {
			if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
			else return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredPullRequests(sortedArray);
		setPaginatedPullRequests(sortedArray.slice(0, itemsPerPage));
		setPage(1);
		sorted && setSortOrder(order);
		setSorted(true);
	};

	const search = (search: string) => {
		const filteredIssues = pullRequests.filter((issue: PullRequest) => {
			return issue.Title.toLowerCase().includes(search.toLowerCase());
		});

		let sortedArray = [...filteredIssues];
		if (sorted) {
			sortedArray = [...filteredIssues].sort((a: PullRequest, b: PullRequest) => {
				if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
				else return -1;
			});

			if (!sortOrder) sortedArray = sortedArray.reverse();
		}

		setFilteredPullRequests(sortedArray);
		setPaginatedPullRequests(sortedArray.slice(0, itemsPerPage));
		setPage(1);
	};

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedPullRequests(filteredPullRequests.slice((value - 1) * itemsPerPage, value * itemsPerPage));
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
								setSortBy(event.target.value as keyof PullRequest);
								sort(event.target.value as keyof PullRequest);
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
				{paginatedPullRequests?.map((gitIssue: PullRequest, index: number) => {
					return (
						<React.Fragment key={index}>
							<ListItem>
								<Grid container spacing={2}>
									<Grid container alignItems="center" item xs={12}>
										<Link target="_blank" href={gitIssue.Link}>
											{gitIssue.Title}
										</Link>
									</Grid>
								</Grid>
							</ListItem>
							{paginatedPullRequests.length - 1 !== index && <Divider />}
						</React.Fragment>
					);
				})}
				{pullRequests.length > 10 && (
					<Pagination
						count={Math.ceil(filteredPullRequests.length / itemsPerPage)}
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
