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
	Paper,
	InputBase,
	Box,
	Hidden
} from "@material-ui/core";
import { Project, NotificationType } from "../models";
import { getProjects, addProjects, updateProjects, deleteProject } from "../apis";
import { AuthContext, NotificationContext } from "../helpers";
import { PROJECTS } from "../constants";
import { Delete, Edit, Save, Close, Sort, Search, Add, MoreVertOutlined } from "@material-ui/icons";
import { Skeleton, Pagination, SpeedDialAction, SpeedDialIcon, SpeedDial } from "@material-ui/lab";
import useStyles from "../theme";
import { useFormik } from "formik";
import { Notify } from "../utils";
import { EmptyPlaceholder, NoResultPlaceholder } from "../components";

const SORT_BY: {
	key: keyof Project;
	text: string;
}[] = [
	{
		key: "Title",
		text: "Title"
	},
	{
		key: "Mentor",
		text: "Mentor"
	}
];
interface Sort {
	Title: boolean;
	Mentor: boolean;
	[key: string]: boolean;
}

export const Projects = (): ReactElement => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [paginatedProjects, setPaginatedProjects] = useState<Project[]>([]);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
	const [range, setRange] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [editIndex, setEditIndex] = useState(-1);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState<Sort>({ Title: true, Mentor: true });
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteIndex, setDeleteIndex] = useState(-1);
	const [sorted, setSorted] = useState<Sort>({ Title: false, Mentor: false });
	const [speedDialIndex, setSpeedDialIndex] = useState(-1);

	const itemsPerPage = 10;

	const classes = useStyles();

	const { authState } = useContext(AuthContext);
	const { dispatch } = useContext(NotificationContext);

	const init = useRef(true);

	const getProjectsCall = useCallback(() => {
		setIsLoading(true);
		getProjects()
			.then((response) => {
				const ranges: string[] = [];
				const issues: Project[] = [];
				let id = 0;
				response?.values?.forEach((issue: string[], index: number) => {
					if (issue[0] === authState.authData.email) {
						ranges.push(`${PROJECTS}!A${index + 1}:AA${index + 1}`);
						issues.push({
							Email_ID: authState.authData.email,
							Title: issue[1],
							Mentor: issue[2],
							id: id.toString()
						});
						id++;
					}
				});
				setRange(ranges);
				setProjects(issues);

				const filteredIssues = issues.filter((issue: Project) => {
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

				const paginateIssues = issuesToPaginate.slice(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage
				);
				setPaginatedProjects(paginateIssues);
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
	}, [authState.authData, searchQuery, sortOrder, sorted, sortBy, page, dispatch]);

	useEffect(() => {
		if (init.current && getProjectsCall && authState.authData) {
			getProjectsCall();
			init.current = false;
		}
	}, [getProjectsCall, authState.authData]);

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

	const addForm = useFormik({
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.mentor);

			addProjects(rows)
				.then((response) => {
					getProjectsCall();
					resetForm();
					dispatch(
						Notify({
							status: NotificationType.SUCCESS,
							message: "Project was successfully added."
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
			mentor: ""
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.mentor) errors["mentor"] = "Mentor is required.";
			if (!values.title) errors["title"] = "Title is required.";

			return errors;
		}
	});

	const editForm = useFormik({
		onSubmit: (values, { setSubmitting }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(values.title);
			rows.push(values.mentor);

			updateProjects(range[parseInt(paginatedProjects[editIndex].id)], rows)
				.then((response) => {
					setEditIndex(-1);
					getProjectsCall();
					dispatch(
						Notify({
							status: NotificationType.SUCCESS,
							message: "Project was successfully updated."
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
			title: paginatedProjects[editIndex]?.Title ?? "",
			mentor: paginatedProjects[editIndex]?.Mentor ?? ""
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.mentor) errors["mentor"] = "Mentor is required.";
			if (!values.title) errors["title"] = "Title is required.";

			return errors;
		}
	});

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedProjects(filteredProjects.slice((value - 1) * itemsPerPage, value * itemsPerPage));
		setEditIndex(-1);
	};

	const handleDelete = () => {
		deleteProject(range[deleteIndex])
			.then((response) => {
				getProjectsCall();
				dispatch(
					Notify({
						status: NotificationType.SUCCESS,
						message: "Project was successfully deleted."
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
								name="mentor"
								label="Mentor"
								fullWidth
								value={addForm.values.mentor}
								onBlur={addForm.handleBlur}
								onChange={addForm.handleChange}
								helperText={addForm.touched.mentor && addForm.errors.mentor && addForm.errors.mentor}
								error={!!(addForm.touched.mentor && addForm.errors.mentor)}
							/>
						</Grid>
						<Grid item md={2} xs={12} sm={12} className={classes.addButtonGrid}>
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
							<Grid container item xs={5}>
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
								<Typography variant="subtitle1">Project Name</Typography>
							</Grid>
							<Grid container item xs={5}>
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
												: "scaleY(-1)"
										}}
									/>
								</IconButton>
								<Typography variant="subtitle1">Mentor</Typography>
							</Grid>
						</Grid>
					</ListItem>
					{isLoading ? (
						listSkeletons()
					) : projects?.length === 0 ? (
						<EmptyPlaceholder
							title="The are no blogs to show here"
							subtitle="Why not add a new blog to show here?"
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
																name="mentor"
																label="Mentor"
																fullWidth
																value={editForm.values.mentor}
																onBlur={editForm.handleBlur}
																onChange={editForm.handleChange}
																helperText={
																	editForm.touched.mentor &&
																	editForm.errors.mentor &&
																	editForm.errors.mentor
																}
																error={
																	!!(
																		editForm.touched.mentor &&
																		editForm.errors.mentor
																	)
																}
															/>
														</Grid>
													</form>
												</Grid>
											) : (
												<>
													<Grid container alignItems="center" item xs={5} md={5}>
														<Typography component="h4">{gitIssue.Title}</Typography>
													</Grid>
													<Grid container alignItems="center" item xs={5} md={4}>
														<Typography component="h4">{gitIssue.Mentor}</Typography>
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
									{paginatedProjects.length - 1 !== index && <Divider />}
								</React.Fragment>
							);
						})
					)}
					{!isLoading && filteredProjects.length > 10 && (
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
			</Paper>
		</>
	);
};
