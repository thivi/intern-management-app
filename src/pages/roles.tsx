import React, { ReactElement, useState, useContext, useCallback, useEffect, ChangeEvent, useRef } from "react";
import {
	Grid,
	TextField,
	Button,
	List,
	ListItem,
	Divider,
	IconButton,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	OutlinedInput,
	Dialog,
	DialogActions,
	DialogContentText,
	DialogContent,
	FormHelperText,
} from "@material-ui/core";
import { Role, RoleType } from "../models";
import { getRoles, addRoles, updateRoles, deleteRole } from "../apis";
import { AuthContext } from "../helpers";
import { ROLES } from "../constants";
import { Delete, Edit, Save, Close, Sort, Search } from "@material-ui/icons";
import { Skeleton, Pagination } from "@material-ui/lab";
import useStyles from "../theme";
import { useFormik } from "formik";
import validator from "validator";

const SORT_BY: {
	key: keyof Role;
	text: string;
}[] = [
	{
		key: "Email_ID",
		text: "Email",
	},
];

const ROLES_OPTIONS = [
	{
		key: "admin",
		text: "Admin",
	},
	{
		key: "intern",
		text: "Intern",
	},
	{
		key: "mentor",
		text: "Mentor",
	},
];

const SHOW_ROLE_OPTIONS = [
	{
		key: "all",
		text: "All",
	},
	{
		key: "admin",
		text: "Admin",
	},
	{
		key: "intern",
		text: "Intern",
	},
	{
		key: "mentor",
		text: "Mentor",
	},
];

export const Roles = (): ReactElement => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [paginatedRoles, setPaginatedRoles] = useState<Role[]>([]);
	const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
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
	const [showRole, setShowRole] = useState(SHOW_ROLE_OPTIONS[0].key);

	const itemsPerPage = 10;

	const classes = useStyles();

	const init = useRef(true);
	const showInit = useRef(true);

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
						role: issue[1] as RoleType,
						id: id.toString(),
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
				//TODO: Notify
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [searchQuery, sortOrder, sorted, sortBy, page]);

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
							<Skeleton variant="text" />
						</Grid>
					</Grid>
				</ListItem>
			);
		}

		return <List>{skeletons}</List>;
	};

	const sort = (sortBy: keyof Role, order?: boolean) => {
		let sortedArray = [...filteredRoles].sort((a: Role, b: Role) => {
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
				const matchesQuery = issue.Email_ID.toLowerCase().includes(query);
				const show = roleFilter ? issue.role === showRole : true;
				return matchesQuery && show;
			});

			let sortedArray = [...filteredIssues];
			if (sorted) {
				sortedArray = [...filteredIssues].sort((a: Role, b: Role) => {
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
			rows.push(values.role);

			addRoles(rows)
				.then((response) => {
					getRolesCall();
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
			email: "",
			role: "intern",
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.email) errors["email"] = "Email is required.";
			if (!values.role) errors["role"] = "Role is required.";
			if (values.email && !validator.isEmail(values.email))
				errors["email"] = "The email is invalid. " + (errors["email"] ?? "");

			return errors;
		},
	});

	const editForm = useFormik({
		onSubmit: (values, { setSubmitting }) => {
			const rows = [];
			rows.push(values.email);
			rows.push(values.role);

			updateRoles(range[parseInt(paginatedRoles[editIndex].id)], rows)
				.then((response) => {
					setEditIndex(-1);
					getRolesCall();
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
			email: paginatedRoles[editIndex]?.Email_ID ?? "",
			role: paginatedRoles[editIndex]?.role ?? "",
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.email) errors["email"] = "Email is required.";
			if (!values.role) errors["role"] = "Role is required.";
			if (values.email && !validator.isEmail(values.email))
				errors["email"] = "The email is invalid. " + (errors["email"] ?? "");

			return errors;
		},
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
			<Card variant="outlined">
				<CardContent>
					<form noValidate onSubmit={addForm.handleSubmit}>
						<Grid container spacing={2}>
							<Grid xs={5} item>
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
							<Grid xs={5} item>
								<FormControl variant="outlined">
									<InputLabel>Role</InputLabel>
									<Select
										label="Role"
										name="role"
										value={addForm.values.role}
										onBlur={addForm.handleBlur}
										onChange={addForm.handleChange}
										error={!!(addForm.touched.role && addForm.errors.role)}
									>
										{ROLES_OPTIONS.map((option, index: number) => {
											return (
												<MenuItem key={index} value={option.key}>
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
							<Grid item xs={2}>
								<Button type="submit" variant="contained" color="primary">
									Add
								</Button>
							</Grid>
						</Grid>
					</form>
				</CardContent>
			</Card>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					<FormControl variant="outlined">
						<InputLabel>Sort By</InputLabel>
						<Select
							value={sortBy}
							onChange={(event) => {
								setSortBy(event.target.value as keyof Role);
								sort(event.target.value as keyof Role);
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
						<InputLabel>Show Role</InputLabel>
						<Select
							value={showRole}
							onChange={(event) => {
								setShowRole(event.target.value as string);
							}}
							label="Show Role"
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
					<FormControl variant="outlined">
						<InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
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
				{isLoading
					? listSkeletons()
					: paginatedRoles?.map((gitIssue: Role, index: number) => {
							return (
								<React.Fragment key={index}>
									<ListItem>
										<Grid container spacing={2}>
											{editIndex === index ? (
												<Grid container item xs={10}>
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
															<FormControl variant="standard">
																<InputLabel>Role</InputLabel>
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
																>
																	{ROLES_OPTIONS.map((option, index: number) => {
																		return (
																			<MenuItem key={index} value={option.key}>
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
													<Grid container alignItems="center" item xs={5}>
														{gitIssue.Email_ID}
													</Grid>
													<Grid container alignItems="center" item xs={5}>
														{gitIssue.role}
													</Grid>
												</>
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
									{paginatedRoles.length - 1 !== index && <Divider />}
								</React.Fragment>
							);
					  })}
				{!isLoading && roles.length > 10 && (
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
		</>
	);
};
