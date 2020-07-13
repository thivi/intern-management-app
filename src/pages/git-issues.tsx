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
	Box,
	Hidden
} from "@material-ui/core";
import { GitIssue, NotificationType } from "../models";
import { getIssues, addIssues, updateIssues, deleteIssue } from "../apis";
import { AuthContext, NotificationContext } from "../helpers";
import { GIT_ISSUES } from "../constants";
import { Delete, Edit, Save, Close, Sort, Search, Add, MoreVertOutlined } from "@material-ui/icons";
import { Skeleton, Pagination, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";
import useStyles from "../theme";
import { useFormik } from "formik";
import validator from "validator";
import { Notify } from "../utils";
import { NoResultPlaceholder, EmptyPlaceholder } from "../components";

const SORT_BY: {
	key: keyof GitIssue;
	text: string;
}[] = [
	{
		key: "Issue_Title",
		text: "Issue Title"
	}
];

export const GitIssues = (): ReactElement => {
	const [gitIssues, setGitIssues] = useState<GitIssue[]>([]);
	const [paginatedGitIssues, setPaginatedGitIssues] = useState<GitIssue[]>([]);
	const [filteredGitIssues, setFilteredGitIssues] = useState<GitIssue[]>([]);
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
	const [speedDialIndex, setSpeedDialIndex] = useState(-1);

	const itemsPerPage = 10;

	const classes = useStyles();

	const init = useRef(true);

	const { dispatch } = useContext(NotificationContext);

	const getGitIssuesCall = useCallback(() => {
		setIsLoading(true);
		getIssues()
			.then((response) => {
				const ranges: string[] = [];
				const issues: GitIssue[] = [];
				let id = 0;
				response?.values?.forEach((issue: string[], index: number) => {
					if (issue[0] === authState.authData.email) {
						ranges.push(`${GIT_ISSUES}!A${index + 1}:AA${index + 1}`);
						issues.push({
							Email_ID: authState.authData.email,
							Issue_Title: issue[1],
							Link: issue[2],
							id: id.toString()
						});
						id++;
					}
				});
				setRange(ranges);
				setGitIssues(issues);

				const filteredIssues = issues.filter((issue: GitIssue) => {
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

				const paginateIssues = issuesToPaginate.slice(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage
				);
				setPaginatedGitIssues(paginateIssues);
			})
			.catch((error) => {
				Notify({
					status: NotificationType.ERROR,
					message: error
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [authState.authData, searchQuery, sortOrder, sorted, sortBy, page]);

	useEffect(() => {
		if (init.current && getGitIssuesCall && authState.authData) {
			getGitIssuesCall();
			init.current = false;
		}
	}, [getGitIssuesCall, authState.authData]);

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

	const addForm = useFormik({
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.link);

			addIssues(rows)
				.then((response) => {
					getGitIssuesCall();
					resetForm();
					dispatch(
						Notify({
							status: NotificationType.SUCCESS,
							message: "Git Issue was successfully added."
						})
					);
				})
				.catch((error) => {
					Notify({
						status: NotificationType.ERROR,
						message: error
					});
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
		initialValues: {
			title: "",
			link: ""
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.link) errors["link"] = "Link is required.";
			if (!values.title) errors["title"] = "Title is required.";
			if (values.link && !validator.isURL(values.link))
				errors["link"] = "The link should be a valid URL. " + (errors["link"] ?? "");

			return errors;
		}
	});

	const editForm = useFormik({
		onSubmit: (values, { setSubmitting }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.link);

			updateIssues(range[parseInt(paginatedGitIssues[editIndex].id)], rows)
				.then((response) => {
					setEditIndex(-1);
					getGitIssuesCall();
					Notify({
						status: NotificationType.SUCCESS,
						message: "Git Issue was successfully updated."
					});
				})
				.catch((error) => {
					Notify({
						status: NotificationType.ERROR,
						message: error
					});
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
		initialValues: {
			title: paginatedGitIssues[editIndex]?.Issue_Title ?? "",
			link: paginatedGitIssues[editIndex]?.Link ?? ""
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.link) errors["link"] = "Link is required.";
			if (!values.title) errors["title"] = "Title is required.";
			if (!validator.isURL(values.link))
				errors["link"] = "The link should be a valid URL. " + (errors["link"] ?? "");

			return errors;
		}
	});

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedGitIssues(filteredGitIssues.slice((value - 1) * itemsPerPage, value * itemsPerPage));
		setEditIndex(-1);
	};

	const handleDelete = () => {
		deleteIssue(range[deleteIndex])
			.then((response) => {
				getGitIssuesCall();
				dispatch(
					Notify({
						status: NotificationType.SUCCESS,
						message: "Git Issue was successfully deleted."
					})
				);
			})
			.catch((error) => {
				Notify({
					status: NotificationType.ERROR,
					message: error
				});
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
				<Box padding={1}>
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
				</Box>
			</Dialog>
		);
	};

	return (
		<>
			{deleteIndex !== -1 && deleteConfirm()}
			<Paper className={classes.addPaper}>
				<form noValidate onSubmit={addForm.handleSubmit}>
					<Grid container spacing={2}>
						<Grid md={5} xs={12} sm={6} item>
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
						<Grid md={5} xs={12} sm={6} item>
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
						<Grid item md={2} xs={12} sm={12} className={classes.addButtonGrid}>
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
											transform: sorted ? (!sortOrder ? "scaleY(-1)" : "scaleY(1)") : "scaleY(-1)"
										}}
									/>
								</IconButton>
								<Typography variant="subtitle1">Git Issue Title</Typography>
							</Grid>
						</Grid>
					</ListItem>
					{isLoading ? (
						listSkeletons()
					) : gitIssues?.length === 0 ? (
						<EmptyPlaceholder
							title="The are no git issues to show here"
							subtitle="Why not add a new git issue to show here?"
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
                                            {editIndex === index ? (
                                                <Grid container item xs={10} md={9}>
                                                    <form onSubmit={editForm.handleSubmit} className={classes.gridForm}>
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
                                                                    !!(editForm.touched.title && editForm.errors.title)
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
                                                                    !!(editForm.touched.link && editForm.errors.link)
                                                                }
                                                            />
                                                        </Grid>
                                                    </form>
                                                </Grid>
                                            ) : (
                                                <Grid container alignItems="center" item xs={10} md={9}>
                                                    <Link target="_blank" href={gitIssue.Link}>
                                                        <Typography>{gitIssue.Issue_Title}</Typography>
                                                    </Link>
                                                </Grid>
                                            )}
                                            <Grid
                                                container
                                                justify="flex-end"
                                                item
                                                xs={2}
                                                md={3}
                                                className={classes.noOverFlowScrollGrid}
                                                alignItems="center"
                                            >
                                                <Hidden mdUp>
                                                    <SpeedDial
                                                        direction="left"
                                                        icon={
                                                            <SpeedDialIcon
                                                                openIcon={<Close />}
                                                                icon={<MoreVertOutlined />}
                                                            />
                                                        }
                                                        ariaLabel="more options"
                                                        open={speedDialIndex === index}
                                                        onClose={() => {
                                                            setSpeedDialIndex(-1);
                                                        }}
                                                        onOpen={() => {
                                                            setSpeedDialIndex(index);
                                                        }}
                                                        className={classes.speedDial}
                                                    >
                                                        {editIndex !== index && (
                                                            <SpeedDialAction
                                                                aria-label="edit"
                                                                onClick={() => {
                                                                    setSpeedDialIndex(-1);
                                                                    setEditIndex(index);
                                                                }}
                                                                icon={<Edit />}
                                                                tooltipTitle="Edit"
                                                            />
                                                        )}
                                                        {editIndex === index && (
                                                            <SpeedDialAction
                                                                onClick={() => {
                                                                    setSpeedDialIndex(-1);
                                                                    editForm.handleSubmit();
                                                                }}
                                                                aria-label="save"
                                                                tooltipTitle="Save"
                                                                icon={<Save />}
                                                            />
                                                        )}
                                                        {editIndex === index && (
                                                            <SpeedDialAction
                                                                aria-label="close"
                                                                onClick={() => {
                                                                    setSpeedDialIndex(-1);
                                                                    setEditIndex(-1);
                                                                }}
                                                                tooltipTitle="Close"
                                                                icon={<Close />}
                                                            />
                                                        )}
                                                        <SpeedDialAction
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                setSpeedDialIndex(-1);
                                                                setDeleteIndex(parseInt(gitIssue.id));
                                                            }}
                                                            tooltipTitle="Delete"
                                                            icon={<Delete />}
                                                        />
                                                    </SpeedDial>
                                                </Hidden>
                                                <Hidden smDown>
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
                                                </Hidden>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    {paginatedGitIssues.length - 1 !== index && <Divider />}
                                </React.Fragment>
                            );
						})
					)}
					{!isLoading && filteredGitIssues.length > 10 && (
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
			</Paper>
		</>
	);
};
