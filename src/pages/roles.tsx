import React, { ReactElement, useState, useContext, useCallback, useEffect, ChangeEvent, useRef } from "react";
import {
	Grid,
	TextField,
	Button,
	List,
	ListItem,
	Divider,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Dialog,
	DialogActions,
	DialogContentText,
	DialogContent,
	FormHelperText,
	Paper,
	Typography,
	InputBase,
	Box,
	Chip,
	Hidden
} from "@material-ui/core";
import { Role, RoleType, NotificationType } from "../models";
import { getRoles, addRoles, updateRoles, deleteRole } from "../apis";
import { AuthContext, NotificationContext } from "../helpers";
import { ROLES, ADMIN, INTERN, MENTOR, ALL, ANONYMOUS } from "../constants";
import { Delete, Edit, Save, Close, Sort, Search, Add, MoreVertOutlined } from "@material-ui/icons";
import { Skeleton, Pagination, SpeedDialIcon, SpeedDial, SpeedDialAction } from "@material-ui/lab";
import useStyles from "../theme";
import { useFormik } from "formik";
import validator from "validator";
import { Notify } from "../utils";
import { EmptyPlaceholder, NoResultPlaceholder } from "../components";

const SORT_BY: {
	key: keyof Role;
	text: string;
}[] = [
	{
		key: "Email_ID",
		text: "Email"
	}
];

const ROLES_OPTIONS = [
	{
		key: ADMIN,
		text: "Admin"
	},
	{
		key: INTERN,
		text: "Intern"
	},
	{
		key: MENTOR,
		text: "Mentor"
	},
	{
		key: ANONYMOUS,
		text: "Anonymous"
	}
];

const SHOW_ROLE_OPTIONS = [
	{
		key: ALL,
		text: "All"
	},
	{
		key: ADMIN,
		text: "Admin"
	},
	{
		key: INTERN,
		text: "Intern"
	},
	{
		key: MENTOR,
		text: "Mentor"
	},
	{
		key: ANONYMOUS,
		text: "Anonymous"
	}
];

export const Roles = (): ReactElement => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [paginatedRoles, setPaginatedRoles] = useState<Role[]>([]);
	const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
	const [range, setRange] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [editIndex, setEditIndex] = useState(-1);
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState(SORT_BY[0].key);
	// true-Ascending false-Descending
	const [sortOrder, setSortOrder] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteIndex, setDeleteIndex] = useState(-1);
	const [sorted, setSorted] = useState(false);
	const [showRole, setShowRole] = useState(SHOW_ROLE_OPTIONS[0].key);
	const [speedDialIndex, setSpeedDialIndex] = useState(-1);

	const itemsPerPage = 10;

	const classes = useStyles();

	const init = useRef(true);
	const showInit = useRef(true);

	const { authState } = useContext(AuthContext);
	const { dispatch } = useContext(NotificationContext);

	const getRolesCall = useCallback(() => {
		setIsLoading(true);
		getRoles()
			.then((response) => {
				const ranges: string[] = [];
				const issues: Role[] = [];
				let id = 0;
				response?.values?.forEach((issue: string[], index: number) => {
					if (index === 0) {
						return;
					}

					ranges.push(`${ROLES}!A${index + 1}:AA${index + 1}`);
					issues.push({
						Email_ID: issue[0],
						role: issue[1]?.split(" ") as RoleType[],
						id: id.toString()
					});
					id++;
				});
				setRange(ranges);
				setRoles(issues);

				const filteredIssues = issues.filter((issue: Role) => {
					return issue.Email_ID.toLowerCase().includes(searchQuery.toLowerCase());
				});

				let issuesToPaginate;

				if (sorted) {
					let sortedArray = [...filteredIssues].sort((a: Role, b: Role) => {
						if (sortBy === "role") {
							return 0;
						}
						if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
						else return -1;
					});

					if (!sortOrder) sortedArray = sortedArray.reverse();

					issuesToPaginate = [...sortedArray];
				} else {
					issuesToPaginate = [...filteredIssues];
				}

				setFilteredRoles(issuesToPaginate);

				let currentPage = page;

				if (issuesToPaginate.length !== 0 && Math.ceil(issuesToPaginate.length / itemsPerPage) < page) {
					currentPage = Math.ceil(issuesToPaginate.length / itemsPerPage);
					setPage(currentPage);
				}

				const paginateIssues = issuesToPaginate.slice(
					(currentPage - 1) * itemsPerPage,
					currentPage * itemsPerPage
				);
				setPaginatedRoles(paginateIssues);
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
	}, [searchQuery, sortOrder, sorted, sortBy, page, dispatch]);

	useEffect(() => {
		if (init.current && getRolesCall && authState.authData) {
			getRolesCall();
			init.current = false;
		}
	}, [getRolesCall, authState.authData]);

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

	const sort = (sortBy: keyof Role, order?: boolean) => {
		let sortedArray = [...filteredRoles].sort((a: Role, b: Role) => {
			if (sortBy === "role") {
				return 0;
			}
			if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
			else return -1;
		});

		if (order === false) sortedArray = sortedArray.reverse();

		setFilteredRoles(sortedArray);
		setPaginatedRoles(sortedArray.slice(0, itemsPerPage));
		setPage(1);
		sorted && setSortOrder(order);
		setSorted(true);
	};

	const search = useCallback(
		(search: string, roleFilter?: boolean) => {
			const filteredIssues = roles.filter((issue: Role) => {
				const query = roleFilter ? searchQuery.toLowerCase() : search.toLowerCase();
				const matchesQuery = issue.Email_ID?.toLowerCase()?.includes(query);
				const show = roleFilter
					? showRole === "all"
						? true
						: issue.role?.includes(showRole as RoleType)
					: true;
				return matchesQuery && show;
			});

			let sortedArray = [...filteredIssues];
			if (sorted) {
				sortedArray = [...filteredIssues].sort((a: Role, b: Role) => {
					if (sortBy === "role") {
						return 0;
					}
					if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
					else return -1;
				});

				if (!sortOrder) sortedArray = sortedArray.reverse();
			}

			setFilteredRoles(sortedArray);
			setPaginatedRoles(sortedArray.slice(0, itemsPerPage));
			setPage(1);
		},
		[roles, searchQuery, sortBy, sortOrder, sorted, showRole]
	);

	useEffect(() => {
		if (showInit.current) {
			showInit.current = false;
		} else {
			search("", true);
		}
	}, [showRole, search]);

	const addForm = useFormik({
		onSubmit: (values, { setSubmitting, resetForm }) => {
			const rows = [];
			rows.push(values.email);
			rows.push(values.role.join(" "));

			addRoles(rows)
				.then((response) => {
					getRolesCall();
					resetForm();
					dispatch(
						Notify({
							status: NotificationType.SUCCESS,
							message: "Role was successfully added."
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
			email: "",
			role: []
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.email) errors["email"] = "Email is required.";
			if (values.role.length === 0) errors["role"] = "Role is required.";
			if (values.email && !validator.isEmail(values.email))
				errors["email"] = "The email is invalid. " + (errors["email"] ?? "");

			return errors;
		}
	});

	const editForm = useFormik({
		onSubmit: (values, { setSubmitting }) => {
			const rows = [];
			rows.push(values.email);
			rows.push((values.role as RoleType[]).join(" "));

			updateRoles(range[parseInt(paginatedRoles[editIndex].id)], rows)
				.then((response) => {
					setEditIndex(-1);
					getRolesCall();
					dispatch(
						Notify({
							status: NotificationType.SUCCESS,
							message: "Role was successfully updated."
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
			email: paginatedRoles[editIndex]?.Email_ID ?? "",
			role: paginatedRoles[editIndex]?.role ?? []
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.email) errors["email"] = "Email is required.";
			if (!(values.role.length > 0)) errors["role"] = "Role is required.";
			if (values.email && !validator.isEmail(values.email))
				errors["email"] = "The email is invalid. " + (errors["email"] ?? "");

			return errors;
		}
	});

	const handlePageChange = (event: ChangeEvent, value: number) => {
		setPage(value);
		setPaginatedRoles(filteredRoles.slice((value - 1) * itemsPerPage, value * itemsPerPage));
		setEditIndex(-1);
	};

	const handleDelete = () => {
		deleteRole(range[deleteIndex])
			.then((response) => {
				getRolesCall();
				dispatch(
					Notify({
						status: NotificationType.SUCCESS,
						message: "Roles was successfully deleted."
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
								name="email"
								label="Email"
								fullWidth
								value={addForm.values.email}
								onBlur={addForm.handleBlur}
								onChange={addForm.handleChange}
								helperText={addForm.touched.email && addForm.errors.email && addForm.errors.email}
								error={!!(addForm.touched.email && addForm.errors.email)}
							/>
						</Grid>
						<Grid md={5} xs={12} sm={6} item>
							<FormControl variant="outlined" fullWidth className={classes.roleSelect}>
								<InputLabel
									className={addForm.touched.role && addForm.errors.role && classes.roleErrorLabel}
								>
									Role
								</InputLabel>
								<Select
									label="Role"
									name="role"
									value={addForm.values.role}
									onBlur={addForm.handleBlur}
									onChange={addForm.handleChange}
									error={!!(addForm.touched.role && addForm.errors.role)}
									fullWidth
									multiple
									renderValue={(selected) => {
										const selectedValues = selected as RoleType[];
										return (
											<div>
												{selectedValues.map((value: RoleType, index: number) => {
													return <Chip key={index} label={value} />;
												})}
											</div>
										);
									}}
								>
									{ROLES_OPTIONS.map((option, index: number) => {
										return (
											<MenuItem key={index} value={option.key} className={classes.roleSelectList}>
												{option.text}
											</MenuItem>
										);
									})}
								</Select>
								{addForm.touched.role && addForm.errors.role && (
									<FormHelperText>{addForm.errors.role}</FormHelperText>
								)}
							</FormControl>
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
							<Grid item xs={4} md={2}>
								<FormControl variant="filled" fullWidth>
									<InputLabel>Show Role</InputLabel>
									<Select
										value={showRole}
										onChange={(event) => {
											setShowRole(event.target.value as string);
										}}
										label="Show Role"
										fullWidth
										classes={{
											root: classes.selectMenu
										}}
									>
										{SHOW_ROLE_OPTIONS.map((option, index: number) => {
											return (
												<MenuItem key={index} value={option.key}>
													{option.text}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={8} md={4} container justify="flex-end">
								<Paper className={classes.search} variant="outlined">
									<InputBase
										placeholder="Search by email"
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
							<Grid container item xs={5} md={5}>
								<IconButton
									aria-label="sort order"
									onClick={() => {
										setSortBy("Email_ID");
										if (!sorted) {
											sort("Email_ID", sortOrder);
										} else {
											sort("Email_ID", !sortOrder);
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
								<Typography variant="subtitle1">Email</Typography>
							</Grid>
							<Grid container item xs={5} md={4}>
								<Typography variant="subtitle1">Role</Typography>
							</Grid>
						</Grid>
					</ListItem>
					{isLoading ? (
						listSkeletons()
					) : roles?.length === 0 ? (
						<EmptyPlaceholder
							title="The are no roles to show here"
							subtitle="Why not add a new role to show here?"
						/>
					) : filteredRoles?.length === 0 ? (
						<div>
							<NoResultPlaceholder title="No results found" subtitle="Try something else?" />
						</div>
					) : (
						paginatedRoles?.map((gitIssue: Role, index: number) => {
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
																name="email"
																label="Email"
																fullWidth
																value={editForm.values.email}
																onBlur={editForm.handleBlur}
																onChange={editForm.handleChange}
																className={classes.roleEmail}
																helperText={
																	editForm.touched.email &&
																	editForm.errors.email &&
																	editForm.errors.email
																}
																error={
																	!!(editForm.touched.email && editForm.errors.email)
																}
															/>
														</Grid>
														<Grid xs={6} item>
															<FormControl
																variant="standard"
																fullWidth
																className={classes.roleSelect}
															>
																<InputLabel
																	className={
																		editForm.touched.role &&
																		editForm.errors.role &&
																		classes.roleErrorLabel
																	}
																>
																	Role
																</InputLabel>
																<Select
																	label="Role"
																	name="role"
																	value={editForm.values.role}
																	onBlur={editForm.handleBlur}
																	onChange={editForm.handleChange}
																	error={
																		!!(
																			editForm.touched.role &&
																			editForm.errors.role
																		)
																	}
																	fullWidth
																	multiple
																	renderValue={(selected) => {
																		const selectedValues = selected as RoleType[];
																		return (
																			<div>
																				{selectedValues.map(
																					(
																						value: RoleType,
																						index: number
																					) => {
																						return (
																							<Chip
																								key={index}
																								label={value}
																							/>
																						);
																					}
																				)}
																			</div>
																		);
																	}}
																>
																	{ROLES_OPTIONS.map((option, index: number) => {
																		return (
																			<MenuItem
																				key={index}
																				value={option.key}
																				className={classes.roleSelectList}
																			>
																				{option.text}
																			</MenuItem>
																		);
																	})}
																</Select>
																{editForm.touched.role && editForm.errors.role && (
																	<FormHelperText>
																		{editForm.errors.role}
																	</FormHelperText>
																)}
															</FormControl>
														</Grid>
													</form>
												</Grid>
											) : (
												<>
													<Grid container alignItems="center" item xs={5} md={5}>
														<Typography>{gitIssue.Email_ID}</Typography>
													</Grid>
													<Grid container alignItems="center" item xs={5} md={4}>
														{gitIssue?.role?.map((role: string, index: number) => (
															<Chip
																key={index}
																label={role}
																className={classes.roleChip}
															/>
														))}
													</Grid>
												</>
											)}
											<Grid container justify="flex-end" item xs={2} md={3}>
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
									{paginatedRoles.length - 1 !== index && <Divider />}
								</React.Fragment>
							);
						})
					)}
					{!isLoading && filteredRoles.length > 10 && (
						<Pagination
							count={Math.ceil(filteredRoles.length / itemsPerPage)}
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
