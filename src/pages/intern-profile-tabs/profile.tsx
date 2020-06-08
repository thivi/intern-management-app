import React, { ReactElement } from "react";
import { Profile } from "../../models";
import { Grid, Typography, Paper } from "@material-ui/core";
import useStyles from "../../theme";

interface ProfileTabPropsInterface {
	profile: Profile;
}

export const ProfileTab = (props: ProfileTabPropsInterface): ReactElement => {
	const { profile } = props;

	const classes = useStyles();
	return (
		<>
			<Paper className={classes.fieldsPaper}>
				<Grid container spacing={2}>
					<Typography variant="h6">Personal Information</Typography>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Name</Typography>
						<Typography>{profile.Name}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Email</Typography>
						<Typography>{profile.Email_ID}</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper className={classes.fieldsPaper}>
				<Grid container spacing={2}>
					<Typography variant="h6">Academic Credentials</Typography>
					<Grid item xs={12}>
						<Typography variant="subtitle2">University</Typography>
						<Typography>{profile.University}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Degree</Typography>
						<Typography>{profile.Degree}</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper className={classes.fieldsPaper}>
				<Grid container spacing={2}>
					<Typography variant="h6">Internship Period</Typography>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Joined Date</Typography>
						<Typography>{profile.Joined_date}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Leaving Date</Typography>
						<Typography>{profile.Leaving_date}</Typography>
					</Grid>
				</Grid>
			</Paper>

			<Paper className={classes.fieldsPaper}>
				<Grid container spacing={2}>
					<Typography variant="h6">Contacts</Typography>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Contact No.</Typography>
						<Typography>{profile.Contact_no}</Typography>
					</Grid>
				</Grid>
			</Paper>
			<Paper className={classes.fieldsPaper}>
				<Grid container spacing={2}>
					<Typography variant="h6">Mentors</Typography>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Mentor</Typography>
						<Typography>{profile.Mentor}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Co-mentor</Typography>
						<Typography>{profile.Co_mentor}</Typography>
					</Grid>
				</Grid>
			</Paper>
			<Paper className={classes.fieldsPaper}>
				<Grid container spacing={2}>
					<Typography variant="h6">Links</Typography>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Blog</Typography>
						<Typography>{profile.Blog}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle2">Gantt Chart</Typography>
						<Typography>{profile.Gantt_chart}</Typography>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
};
