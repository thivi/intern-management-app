import React, { ReactElement, useEffect, useState, useCallback, useContext } from "react";
import { getProfile, updateProfile, addProfile } from "../apis";
import { Profile, NotificationType } from "../models";
import { Grid, Avatar, Typography, TextField, Button, Paper, Box } from "@material-ui/core";
import { useFormik } from "formik";
import { convertKeyToLabel, Notify } from "../utils";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Moment } from "moment";
import { Skeleton } from "@material-ui/lab";
import validator from "validator";
import { AuthContext, NotificationContext } from "../helpers";
import { INTERN_PROFILE } from "../constants";
import useStyles from "../theme";

export const ProfilePage = (): ReactElement => {
	const [profile, setProfile] = useState<Profile>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [range, setRange] = useState("");

	const { authState } = useContext(AuthContext);
	const { dispatch } = useContext(NotificationContext);

	const classes = useStyles();

	const formik = useFormik({
		onSubmit: (values, { setSubmitting }) => {
			const rows = [];
			rows.push(authState.authData.email);
			rows.push(authState.authData.name);
			rows.push(values.university);
			rows.push(values.degree);
			rows.push(values.joined_date);
			rows.push(values.leaving_date);
			rows.push(values.contact_number);
			rows.push(values.mentor);
			rows.push(values.co_mentor);
			rows.push(values.blog);
			rows.push(values.gantt_chart);

			if (profile) {
				updateProfile(range, rows)
					.then((response) => {
						getProfileCall();
						dispatch(
							Notify({
								status: NotificationType.SUCCESS,
								message: "Profile was successfully added.",
							})
						);
					})
					.catch((error) => {
						dispatch(
							Notify({
								status: NotificationType.ERROR,
								message: error,
							})
						);
					})
					.finally(() => {
						setSubmitting(true);
					});
			} else {
				addProfile(rows)
					.then((response) => {
						getProfileCall();
						dispatch(
							Notify({
								status: NotificationType.SUCCESS,
								message: "Profile was successfully added.",
							})
						);
					})
					.catch((error) => {
						dispatch(
							Notify({
								status: NotificationType.ERROR,
								message: error,
							})
						);
					})
					.finally(() => {
						setSubmitting(true);
					});
			}
		},
		enableReinitialize: true,
		initialValues: {
			university: profile?.University,
			degree: profile?.Degree,
			joined_date: profile?.Joined_date ?? new Date().toDateString(),
			leaving_date: profile?.Leaving_date ?? new Date(new Date().getTime() + 15552000000).toDateString(),
			contact_number: profile?.Contact_no,
			mentor: profile?.Mentor,
			co_mentor: profile?.Co_mentor,
			blog: profile?.Blog,
			gantt_chart: profile?.Gantt_chart,
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};

			Object.entries(values).forEach(([key, value]) => {
				if (!value) errors[key] = `${convertKeyToLabel(key)} is required`;
			});

			if (
				values.contact_number &&
				!(values.contact_number.match(/\d{10}/) || values.contact_number.match(/\d{9}/))
			)
				errors["contact_number"] =
					"Contact number is not of the right format. " + (errors["contact_number"] ?? "");
			if (values.blog && !validator.isURL(values.blog))
				errors["blog"] = "Blog link should be a url. " + (errors["blog"] ?? "");
			if (values.gantt_chart && !validator.isURL(values.gantt_chart))
				errors["gantt_chart"] = "Gannt Chart should be a link. " + (errors["gantt_chart"] ?? "");
			if (
				values.leaving_date &&
				values.joined_date &&
				new Date(values.leaving_date) <= new Date(values.joined_date)
			)
				errors["leaving_date"] =
					"Leaving Date should be later than the joined date. " + (errors["leaving_date"] ?? "");
			if (values.mentor && !validator.isEmail(values.mentor))
				errors["mentor"] = "Co-mentor email should be a valid email address. " + (errors["mentor"] ?? "");
			if (values.co_mentor && !validator.isEmail(values.co_mentor))
				errors["co_mentor"] = "Co-mentor email should be a valid email address. " + (errors["co_mentor"] ?? "");
			return errors;
		},
	});

	const { handleSubmit, touched, errors, values, handleChange, handleBlur, setFieldValue } = formik;

	const getProfileCall = useCallback(() => {
		setIsLoading(true);
		getProfile()
			.then((response) => {
				const rawProfile = response?.values?.find((value: string[], index: number) => {
					if (value[0] === authState.authData.email) {
						setRange(`${INTERN_PROFILE}!A${index + 1}:AA${index + 1}`);
						return true;
					}
				});
				const profile: Profile = {
					Email_ID: rawProfile[0],
					Name: rawProfile[1],
					University: rawProfile[2],
					Degree: rawProfile[3],
					Joined_date: rawProfile[4],
					Leaving_date: rawProfile[5],
					Contact_no: rawProfile[6],
					Mentor: rawProfile[7],
					Co_mentor: rawProfile[8],
					Blog: rawProfile[9],
					Gantt_chart: rawProfile[10],
				};
				setProfile(profile);
			})
			.catch((error) => {
				dispatch(
					Notify({
						status: NotificationType.ERROR,
						message: error,
					})
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [authState.authData, dispatch]);

	useEffect(() => {
		getProfileCall();
	}, [authState.authData, getProfileCall]);

	return (
		<>
			<Grid container spacing={2}>
				<Grid item xs={2}>
					<Avatar className={classes.profileAvatar} src={authState.authData?.picture} />
				</Grid>
				<Grid item xs={10}>
					<Typography variant="h4">{authState.authData?.name}</Typography>
					<Typography variant="h5" color="textSecondary">
						{authState.authData?.email}
					</Typography>
				</Grid>
			</Grid>

			<form noValidate onSubmit={handleSubmit}>
				<Paper className={classes.fieldsPaper}>
					<Typography variant="h5" className={classes.fieldsHeader}>
						Academic Credentials
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							{isLoading ? (
								<Skeleton variant="text" height={80} />
							) : (
								<Box marginBottom={2}>
									<TextField
										name="university"
										placeholder="eg: University of Colombo, University of Moratuwa etc."
										value={values.university ?? ""}
										onChange={handleChange}
										variant="outlined"
										label="University"
										fullWidth
										helperText={touched.university && errors.university && errors.university}
										onBlur={handleBlur}
										error={!!(touched.university && errors.university)}
									/>
								</Box>
							)}
						</Grid>
						<Grid item xs={12}>
							{isLoading ? (
								<Skeleton variant="text" height={80} />
							) : (
								<Box marginBottom={2}>
									<TextField
										name="degree"
										placeholder={
											"eg: B.Sc. in Information Technology, B.Eng. in Software Engineering etc."
										}
										value={values.degree ?? ""}
										variant="outlined"
										label="Degree"
										fullWidth
										onChange={handleChange}
										helperText={touched.degree && errors.degree && errors.degree}
										onBlur={handleBlur}
										error={!!(touched.degree && errors.degree)}
									/>
								</Box>
							)}
						</Grid>
					</Grid>
				</Paper>
				<Paper className={classes.fieldsPaper}>
					<Typography variant="h5" className={classes.fieldsHeader}>
						Internship Period
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								{isLoading ? (
									<Skeleton variant="text" height={80} />
								) : (
									<KeyboardDatePicker
										name="joined_date"
										placeholder={"eg: " + new Date().toDateString()}
										value={values.joined_date}
										label="Joined Date"
										fullWidth
										helperText={touched.joined_date && errors.joined_date && errors.joined_date}
										onBlur={handleBlur}
										margin="normal"
										format="DD-MM-YYYY"
										onChange={(date: Moment) => {
											setFieldValue("joined_date", date);
										}}
										KeyboardButtonProps={{
											"aria-label": "change date",
										}}
										error={!!(touched.joined_date && errors.joined_date)}
									/>
								)}
							</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={12}>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								{isLoading ? (
									<Skeleton variant="text" height={80} />
								) : (
									<KeyboardDatePicker
										name="leaving_date"
										placeholder={
											"eg: " + new Date(new Date().getTime() + 15552000000).toDateString()
										}
										label="Leaving Date"
										fullWidth
										onBlur={handleBlur}
										margin="normal"
										format="DD-MM-YYYY"
										onChange={(date: Moment) => {
											setFieldValue("leaving_date", date);
										}}
										KeyboardButtonProps={{
											"aria-label": "change date",
										}}
										value={values.leaving_date}
										helperText={touched.leaving_date && errors.leaving_date && errors.leaving_date}
										error={!!(touched.leaving_date && errors.leaving_date)}
									/>
								)}
							</MuiPickersUtilsProvider>
						</Grid>
					</Grid>
				</Paper>

				<Paper className={classes.fieldsPaper}>
					<Typography variant="h5" className={classes.fieldsHeader}>
						Contacts
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							{isLoading ? (
								<Skeleton variant="text" height={80} />
							) : (
								<Box marginBottom={2}>
									<TextField
										name="contact_number"
										placeholder="eg: 077756896532"
										value={values.contact_number ?? ""}
										variant="outlined"
										label="Contact Number"
										fullWidth
										onChange={handleChange}
										helperText={
											touched.contact_number && errors.contact_number && errors.contact_number
										}
										onBlur={handleBlur}
										error={!!(touched.contact_number && errors.contact_number)}
									/>
								</Box>
							)}
						</Grid>
					</Grid>
				</Paper>

				<Paper className={classes.fieldsPaper}>
					<Typography variant="h5" className={classes.fieldsHeader}>
						Mentors
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							{isLoading ? (
								<Skeleton variant="text" height={80} />
							) : (
								<Box marginBottom={2}>
									<TextField
										name="mentor"
										placeholder="eg: John Doe"
										value={values.mentor ?? ""}
										variant="outlined"
										label="Mentor email"
										fullWidth
										onChange={handleChange}
										helperText={touched.mentor && errors.mentor && errors.mentor}
										onBlur={handleBlur}
										error={!!(touched.mentor && errors.mentor)}
									/>
								</Box>
							)}
						</Grid>
						<Grid item xs={12}>
							{isLoading ? (
								<Skeleton variant="text" height={80} />
							) : (
								<Box marginBottom={2}>
									<TextField
										name="co_mentor"
										placeholder="eg: John Doe"
										value={values.co_mentor ?? ""}
										variant="outlined"
										label="Co-mentor email"
										fullWidth
										onChange={handleChange}
										helperText={touched.co_mentor && errors.co_mentor && errors.co_mentor}
										onBlur={handleBlur}
										error={!!(touched.co_mentor && errors.co_mentor)}
									/>
								</Box>
							)}
						</Grid>
					</Grid>
				</Paper>

				<Paper className={classes.fieldsPaper}>
					<Typography variant="h5" className={classes.fieldsHeader}>
						Links
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							{isLoading ? (
								<Skeleton variant="text" height={80} />
							) : (
								<Box marginBottom={2}>
									<TextField
										name="blog"
										placeholder="eg: https://www.thearmchaircritic.org"
										value={values.blog ?? ""}
										variant="outlined"
										label="Blog Link"
										fullWidth
										onChange={handleChange}
										helperText={touched.blog && errors.blog && errors.blog}
										onBlur={handleBlur}
										error={!!(touched.blog && errors.blog)}
									/>
								</Box>
							)}
						</Grid>
						<Grid item xs={12}>
							{isLoading ? (
								<Skeleton variant="text" height={80} />
							) : (
								<Box marginBottom={2}>
									<TextField
										name="gantt_chart"
										placeholder="eg: https://docs.google.com/..."
										value={values.gantt_chart ?? ""}
										variant="outlined"
										label="Link to Gantt Chart"
										fullWidth
										onChange={handleChange}
										helperText={touched.gantt_chart && errors.gantt_chart && errors.gantt_chart}
										onBlur={handleBlur}
										error={!!(touched.gantt_chart && errors.gantt_chart)}
									/>
								</Box>
							)}
						</Grid>
					</Grid>
				</Paper>
				<Grid container spacing={2}>
					<Grid item xs={12} className={classes.leftAlignedGrid}>
						<Button className={classes.primaryButton} color="primary" variant="contained" type="submit">
							Submit
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	);
};
