import React, { ReactElement, useState, useContext, useCallback, useEffect, ChangeEvent, useRef } from "react";
import {
	Grid,
	TextField,
	Button,
	List,
	ListItem,
	Divider,
	IconButton,
	Dialog,
	DialogActions,
	DialogContentText,
	DialogContent,
	Typography,
	FormControlLabel,
	Checkbox,
	Paper,
	InputBase,
	Switch,
	Box,
	useMediaQuery,
	Theme,
	Link,
	Hidden
} from "@material-ui/core";
import { ProjectTask, NotificationType } from "../models";
import { getProjectTasks, addProjectTasks, updateProjectTasks, deleteProject } from "../apis";
import { AuthContext, NotificationContext } from "../helpers";
import { PROJECT_TASKS } from "../constants";
import { Delete, Edit, Save, Close, Sort, Search, Add, MoreVertOutlined } from "@material-ui/icons";
import { Skeleton, Pagination, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import useStyles from "../theme";
import { useFormik } from "formik";
import validator from "validator";
import { Notify } from "../utils";
import { NoResultPlaceholder, EmptyPlaceholder } from "../components";

const SORT_BY: {
	key: keyof ProjectTask;
	text: string;
}[] = [
	{
		key: "Title",
		text: "Title"
	},
	{
		key: "PullRequest",
		text: "PullRequest"
	}
];

interface Sort {
	Title: boolean;
	PullRequest: boolean;
	[key: string]: boolean;
}

export const ProjectTasks = (): ReactElement => {
	const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
	const [paginatedProjectTasks, setPaginatedProjectTasks] = useState<ProjectTask[]>([]);
	const [filteredProjectTasks, setFilteredProjectTasks] = useState<ProjectTask[]>([]);
	const [range, setRange] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [editIndex, setEditIndex] = useState(-1);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState<Sort>({ Title: true, PullRequest: true });
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteIndex, setDeleteIndex] = useState(-1);
	const [sorted, setSorted] = useState<Sort>({ Title: false, PullRequest: false });
	const [hideCompleted, setHideCompleted] = useState(false);
	const [speedDialIndex, setSpeedDialIndex] = useState(-1);

	const { authState } = useContext(AuthContext);
	const { dispatch } = useContext(NotificationContext);

	const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

	const itemsPerPage = 10;

	const classes = useStyles();

	const init = useRef(true);

	const getProjectTasksCall = useCallback(() => {
		setIsLoading(true);
		getProjectTasks()
			.then((response) => {
				const ranges: string[] = [];
				const issues: ProjectTask[] = [];
				let id = 0;
				response?.values?.forEach((issue: string[], index: number) => {
					if (issue[0] === authState.authData.email) {
						ranges.push(`${PROJECT_TASKS}!A${index + 1}:AA${index + 1}`);
						issues.push({
							Email_ID: authState.authData.email,
							Title: issue[1],
							PullRequest: issue[2],
							Completed: issue[3],
							id: id.toString()
						});
						id++;
					}
				});
				setRange(ranges);
				setProjectTasks(issues);

				const filteredIssues = issues.filter((issue: ProjectTask) => {
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

				const paginateIssues = issuesToPaginate.slice(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage
				);
				setPaginatedProjectTasks(paginateIssues);
			})
			.catch((error) => {
				dispatch(
					Notify({
						status: NotificationType.ERROR,
						message: error
					})
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [authState.authData, searchQuery, sortOrder, sorted, sortBy, page, hideCompleted, dispatch]);

	useEffect(() => {
		if (init.current && getProjectTasksCall && authState.authData) {
			getProjectTasksCall();
			init.current = false;
		}
	}, [getProjectTasksCall, authState.authData]);

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

	const addForm = useFormik({
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.pullRequest);
			rows.push(values.completed ? "yes" : "no");

			addProjectTasks(rows)
				.then((response) => {
					getProjectTasksCall();
					resetForm();
					dispatch(
						Notify({
							status: NotificationType.SUCCESS,
							message: "Project Task was successfully added."
						})
					);
				})
				.catch((error) => {
					dispatch(
						Notify({
							status: NotificationType.ERROR,
							message: error
						})
					);
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
		initialValues: {
			title: "",
			pullRequest: "",
			completed: false
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.pullRequest) errors["pullRequest"] = "PullRequest is required.";
			if (!validator.isURL(values.pullRequest))
				errors["pullRequest"] = "Pull Request must be a valid URL. " + (errors["pullRequest"] ?? "");
			if (!values.title) errors["title"] = "Title is required.";

			return errors;
		}
	});

	const editForm = useFormik({
		onSubmit: (values, { setSubmitting }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.pullRequest);
			rows.push(values.completed ? "yes" : "no");

			updateProjectTasks(range[parseInt(paginatedProjectTasks[editIndex].id)], rows)
				.then((response) => {
					setEditIndex(-1);
					getProjectTasksCall();
					dispatch(
						Notify({
							status: NotificationType.SUCCESS,
							message: "Project Task was successfully updated."
						})
					);
				})
				.catch((error) => {
					dispatch(
						Notify({
							status: NotificationType.ERROR,
							message: error
						})
					);
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
		initialValues: {
			title: paginatedProjectTasks[editIndex]?.Title ?? "",
			pullRequest: paginatedProjectTasks[editIndex]?.PullRequest ?? "",
			completed: paginatedProjectTasks[editIndex]?.Completed === "yes"
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.pullRequest) errors["pullRequest"] = "PullRequest is required.";
			if (!validator.isURL(values.pullRequest))
				errors["pullRequest"] = "Pull Request must be a valid URL. " + (errors["pullRequest"] ?? "");
			if (!values.title) errors["title"] = "Title is required.";

			return errors;
		}
	});

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedProjectTasks(filteredProjectTasks.slice((value - 1) * itemsPerPage, value * itemsPerPage));
		setEditIndex(-1);
	};

	const handleDelete = () => {
		deleteProject(range[deleteIndex])
			.then((response) => {
				getProjectTasksCall();
				dispatch(
					Notify({
						status: NotificationType.SUCCESS,
						message: "Project Task was successfully deleted."
					})
				);
			})
			.catch((error) => {
				dispatch(
					Notify({
						status: NotificationType.ERROR,
						message: error
					})
				);
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

	const handleCompleted = (checked: boolean, task: ProjectTask) => {
		const projectTask = { ...task };
		projectTask.Completed = checked ? "yes" : "no";

		const rows = [];
		rows.push(authState.authData.email);
		rows.push(projectTask.Title);
		rows.push(projectTask.PullRequest);
		rows.push(projectTask.Completed);

		updateProjectTasks(range[parseInt(projectTask.id)], rows)
			.then((response) => {
				getProjectTasksCall();
				dispatch(
					Notify({
						status: NotificationType.SUCCESS,
						message: "Project Task was successfully updated."
					})
				);
			})
			.catch((error) => {
				dispatch(
					Notify({
						status: NotificationType.ERROR,
						message: error
					})
				);
			});
	};

	return (
		<>
			{deleteIndex !== -1 && deleteConfirm()}
			<Paper className={classes.addPaper}>
				<form noValidate onSubmit={addForm.handleSubmit}>
					<Grid container spacing={2}>
						<Grid xs={12} sm={6} md={4} item>
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
						<Grid xs={12} sm={6} md={4} item>
							<TextField
								variant="outlined"
								name="pullRequest"
								label="PullRequest"
								fullWidth
								value={addForm.values.pullRequest}
								onBlur={addForm.handleBlur}
								onChange={addForm.handleChange}
								helperText={
									addForm.touched.pullRequest &&
									addForm.errors.pullRequest &&
									addForm.errors.pullRequest
								}
								error={!!(addForm.touched.pullRequest && addForm.errors.pullRequest)}
							/>
						</Grid>
						<Grid item xs={12} md={2} className={classes.addButtonGrid}>
							<FormControlLabel
								control={
									<Checkbox
										checked={addForm.values.completed}
										onChange={addForm.handleChange}
										name="completed"
										onBlur={addForm.handleBlur}
									/>
								}
								label="Completed?"
								labelPlacement={isMdUp ? "bottom" : "start"}
							/>
						</Grid>
						<Grid item xs={12} md={2} className={classes.addButtonGrid}>
							<Button
								className={classes.primaryButton}
								startIcon={<Add />}
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
							<Grid item xs={4} md={2} sm={3} className={classes.noOverFlowScrollGrid}>
								<FormControlLabel
									control={
										<Switch
											checked={hideCompleted}
											onChange={() => search("", true)}
											classes={{
												switchBase: classes.customSwitch
											}}
										/>
									}
									label="Hide Completed"
									labelPlacement="bottom"
									classes={{
										root: classes.switchLabel
									}}
								/>
							</Grid>
							<Grid item xs={8} md={10} sm={9} container justify="flex-end" alignItems="center">
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
							<Grid container item xs={6} md={5}>
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
												: "scaleY(-1)"
										}}
									/>
								</IconButton>
								<Typography variant="subtitle1">Task Name</Typography>
							</Grid>
							<Grid container item xs={4} md={4}>
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
												: "scaleY(-1)"
										}}
									/>
								</IconButton>
								<Typography variant="subtitle1">Pull Request</Typography>
							</Grid>
						</Grid>
					</ListItem>
					{isLoading ? (
						listSkeletons()
					) : projectTasks?.length === 0 ? (
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
																name="pullRequest"
																label="PullRequest"
																fullWidth
																value={editForm.values.pullRequest}
																onBlur={editForm.handleBlur}
																onChange={editForm.handleChange}
																helperText={
																	editForm.touched.pullRequest &&
																	editForm.errors.pullRequest &&
																	editForm.errors.pullRequest
																}
																error={
																	!!(
																		editForm.touched.pullRequest &&
																		editForm.errors.pullRequest
																	)
																}
															/>
														</Grid>
													</form>
												</Grid>
											) : (
												<>
													<Grid item xs={1}>
														<FormControlLabel
															control={
																<Checkbox
																	checked={gitIssue.Completed === "yes"}
																	onChange={(event, checked) =>
																		handleCompleted(checked, gitIssue)
																	}
																	name="completed"
																/>
															}
															label=""
														/>
													</Grid>
													<Grid container alignItems="center" item xs={5} md={4}>
														<Typography component="h4">{gitIssue.Title}</Typography>
													</Grid>
													<Grid container alignItems="center" item xs={4} md={4}>
														<Link href={gitIssue.PullRequest}>
															<Typography component="h4">
																{gitIssue.PullRequest}
															</Typography>
														</Link>
													</Grid>
												</>
											)}
											<Grid
												container
												justify="flex-end"
												item
												xs={2}
												md={3}
												className={classes.noOverFlowScrollGrid}
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
									{paginatedProjectTasks.length - 1 !== index && <Divider />}
								</React.Fragment>
							);
						})
					)}
					{!isLoading && filteredProjectTasks.length > 10 && (
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
			</Paper>
		</>
	);
};
