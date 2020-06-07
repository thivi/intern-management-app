import React, { ReactElement, useState, useContext, useCallback, useEffect, ChangeEvent, useRef } from "react";
import {
	Grid,
	TextField,
	Button,
	List,
	ListItem,
	Link,
	Divider,
	IconButton,
	Dialog,
	DialogActions,
	DialogContentText,
	DialogContent,
	Paper,
	Typography,
	InputBase,
} from "@material-ui/core";
import { PullRequest } from "../models";
import { getPullRequests, addPullRequests, updatePullRequests, deletePullRequest } from "../apis";
import { AuthContext } from "../helpers";
import { PULL_REQUESTS } from "../constants";
import { Delete, Edit, Save, Close, Sort, Search, Add } from "@material-ui/icons";
import { Skeleton, Pagination } from "@material-ui/lab";
import useStyles from "../theme";
import { useFormik } from "formik";
import validator from "validator";

const SORT_BY: {
	key: keyof PullRequest;
	text: string;
}[] = [
	{
		key: "Title",
		text: "Title",
	},
];

export const PullRequests = (): ReactElement => {
	const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
	const [paginatedPullRequests, setPaginatedPullRequests] = useState<PullRequest[]>([]);
	const [filteredPullRequests, setFilteredPullRequests] = useState<PullRequest[]>([]);
	const [range, setRange] = useState<string[]>([]);
	const { authState } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [editIndex, setEditIndex] = useState(-1);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteIndex, setDeleteIndex] = useState(-1);
	const [sorted, setSorted] = useState(false);

	const itemsPerPage = 10;

	const classes = useStyles();

	const init = useRef(true);

	const getPullRequestsCall = useCallback(() => {
		setIsLoading(true);
		getPullRequests()
			.then((response) => {
				const ranges: string[] = [];
				const issues: PullRequest[] = [];
				let id = 0;
				response?.values?.forEach((issue: string[], index: number) => {
					if (issue[0] === authState.authData.email) {
						ranges.push(`${PULL_REQUESTS}!A${index + 1}:AA${index + 1}`);
						issues.push({
							Email_ID: authState.authData.email,
							Title: issue[1],
							Link: issue[2],
							id: id.toString(),
						});
						id++;
					}
				});
				setRange(ranges);
				setPullRequests(issues);

				const filteredIssues = issues.filter((issue: PullRequest) => {
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

				const paginateIssues = issuesToPaginate.slice(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage
				);
				setPaginatedPullRequests(paginateIssues);
			})
			.catch((error) => {
				//TODO: Notify
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [authState.authData, searchQuery, sortOrder, sorted, sortBy, page]);

	useEffect(() => {
		if (init.current && getPullRequestsCall && authState.authData) {
			getPullRequestsCall();
			init.current = false;
		}
	}, [getPullRequestsCall, authState.authData]);

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

	const addForm = useFormik({
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.link);

			addPullRequests(rows)
				.then((response) => {
					getPullRequestsCall();
					resetForm();
					//TODO: Notify
				})
				.catch((error) => {
					//TODO: Notify
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
		initialValues: {
			title: "",
			link: "",
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.link) errors["link"] = "Link is required.";
			if (!values.title) errors["title"] = "Title is required.";
			if (values.link && !validator.isURL(values.link))
				errors["link"] = "The link should be a valid URL. " + (errors["link"] ?? "");

			return errors;
		},
	});

	const editForm = useFormik({
		onSubmit: (values, { setSubmitting }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.link);

			updatePullRequests(range[parseInt(paginatedPullRequests[editIndex].id)], rows)
				.then((response) => {
					setEditIndex(-1);
					getPullRequestsCall();
					//TODO Notify
				})
				.catch((error) => {
					//TODO Notify
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
		initialValues: {
			title: paginatedPullRequests[editIndex]?.Title ?? "",
			link: paginatedPullRequests[editIndex]?.Link ?? "",
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.link) errors["link"] = "Link is required.";
			if (!values.title) errors["title"] = "Title is required.";
			if (!validator.isURL(values.link))
				errors["link"] = "The link should be a valid URL. " + (errors["link"] ?? "");

			return errors;
		},
	});

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedPullRequests(filteredPullRequests.slice((value - 1) * itemsPerPage, value * itemsPerPage));
		setEditIndex(-1);
	};

	const handleDelete = () => {
		deletePullRequest(range[deleteIndex])
			.then((response) => {
				getPullRequestsCall();
				//TODO Notify
			})
			.catch((error) => {
				//TODO Notify
			});
	};

	const deleteConfirm = (): ReactElement => {
		return (
			<Dialog
				open={deleteIndex !== -1}
				onClose={() => {
					setDeleteIndex(-1);
				}}
			>
				<DialogContent>
					<DialogContentText>Do you really want to delete this?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setDeleteIndex(-1);
						}}
					>
						Cancel
					</Button>
					<Button
						color="primary"
						onClick={() => {
							handleDelete();
							setDeleteIndex(-1);
						}}
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	return (
		<>
			{deleteIndex !== -1 && deleteConfirm()}
			<Paper className={classes.addPaper}>
				<form noValidate onSubmit={addForm.handleSubmit}>
					<Grid container spacing={2}>
						<Grid xs={5} item>
							<TextField
								variant="outlined"
								name="title"
								label="Title"
								fullWidth
								value={addForm.values.title}
								onBlur={addForm.handleBlur}
								onChange={addForm.handleChange}
								helperText={addForm.touched.title && addForm.errors.title && addForm.errors.title}
								error={!!(addForm.touched.title && addForm.errors.title)}
							/>
						</Grid>
						<Grid xs={5} item>
							<TextField
								variant="outlined"
								name="link"
								label="Link"
								fullWidth
								value={addForm.values.link}
								onBlur={addForm.handleBlur}
								onChange={addForm.handleChange}
								helperText={addForm.touched.link && addForm.errors.link && addForm.errors.link}
								error={!!(addForm.touched.link && addForm.errors.link)}
							/>
						</Grid>
						<Grid item xs={2} className={classes.addButtonGrid}>
							<Button
								startIcon={<Add />}
								className={classes.primaryButton}
								type="submit"
								variant="contained"
								color="primary"
							>
								Add
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
			<Paper variant="elevation" className={classes.listPaper}>
				<List className={classes.list}>
					<ListItem className={classes.listHeader}>
						<Grid container spacing={2} className={classes.filterGrid}>
							<Grid item xs={12} container justify="flex-end">
								<Paper className={classes.search} variant="outlined">
									<InputBase
										placeholder="Search by pull request title"
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
											transform: sorted
												? !sortOrder
													? "scaleY(-1)"
													: "scaleY(1)"
												: "scaleY(-1)",
										}}
									/>
								</IconButton>
								<Typography variant="subtitle1">Pull Request Title</Typography>
							</Grid>
						</Grid>
					</ListItem>
					{isLoading
						? listSkeletons()
						: paginatedPullRequests?.map((gitIssue: PullRequest, index: number) => {
								return (
									<React.Fragment key={index}>
										<ListItem>
											<Grid container spacing={2}>
												{editIndex === index ? (
													<Grid container item xs={10}>
														<form
															onSubmit={editForm.handleSubmit}
															className={classes.gridForm}
														>
															<Grid xs={6} item className={classes.gridRightMargin}>
																<TextField
																	variant="standard"
																	name="title"
																	label="Title"
																	fullWidth
																	value={editForm.values.title}
																	onBlur={editForm.handleBlur}
																	onChange={editForm.handleChange}
																	helperText={
																		editForm.touched.title &&
																		editForm.errors.title &&
																		editForm.errors.title
																	}
																	error={
																		!!(
																			editForm.touched.title &&
																			editForm.errors.title
																		)
																	}
																/>
															</Grid>
															<Grid xs={6} item>
																<TextField
																	variant="standard"
																	name="link"
																	label="Link"
																	fullWidth
																	value={editForm.values.link}
																	onBlur={editForm.handleBlur}
																	onChange={editForm.handleChange}
																	helperText={
																		editForm.touched.link &&
																		editForm.errors.link &&
																		editForm.errors.link
																	}
																	error={
																		!!(
																			editForm.touched.link &&
																			editForm.errors.link
																		)
																	}
																/>
															</Grid>
														</form>
													</Grid>
												) : (
													<Grid container alignItems="center" item xs={10}>
														<Link target="_blank" href={gitIssue.Link}>
															<Typography>{gitIssue.Title}</Typography>
														</Link>
													</Grid>
												)}
												<Grid container justify="flex-end" item xs={2}>
													{editIndex !== index && (
														<IconButton
															aria-label="edit"
															onClick={() => {
																setEditIndex(index);
															}}
														>
															<Edit />
														</IconButton>
													)}
													{editIndex === index && (
														<IconButton
															onClick={() => editForm.handleSubmit()}
															type="submit"
															aria-label="save"
														>
															<Save />
														</IconButton>
													)}
													{editIndex === index && (
														<IconButton
															aria-label="close"
															onClick={() => {
																setEditIndex(-1);
															}}
														>
															<Close />
														</IconButton>
													)}
													<IconButton
														aria-label="delete"
														onClick={() => {
															setDeleteIndex(parseInt(gitIssue.id));
														}}
													>
														<Delete />
													</IconButton>
												</Grid>
											</Grid>
										</ListItem>
										{paginatedPullRequests.length - 1 !== index && <Divider />}
									</React.Fragment>
								);
						  })}
					{!isLoading && pullRequests.length > 10 && (
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
			</Paper>
		</>
	);
};
