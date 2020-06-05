import React, { ReactElement } from "react";
import { Profile } from "../../models";
import { Grid, Typography } from "@material-ui/core";

interface ProfileTabPropsInterface {
	profile: Profile;
}

export const ProfileTab = (props: ProfileTabPropsInterface): ReactElement => {
	const { profile } = props;
	return (
		<Grid container spacing={2}>
			<Typography variant="h6">Personal Information</Typography>
			<Grid item xs={12}>
				<Typography>Name</Typography>
				<Typography>{profile.Name}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>Email</Typography>
				<Typography>{profile.Email_ID}</Typography>
			</Grid>
			<Typography variant="h6">Academic Credentials</Typography>
			<Grid item xs={12}>
				<Typography>University</Typography>
				<Typography>{profile.University}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>Degree</Typography>
				<Typography>{profile.Degree}</Typography>
			</Grid>

			<Typography variant="h6">Internship Period</Typography>
			<Grid item xs={12}>
				<Typography>Joined Date</Typography>
				<Typography>{profile.Joined_date}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>Leaving Date</Typography>
				<Typography>{profile.Leaving_date}</Typography>
			</Grid>

			<Typography variant="h6">Contacts</Typography>
			<Grid item xs={12}>
				<Typography>Contact No.</Typography>
				<Typography>{profile.Contact_no}</Typography>
			</Grid>

			<Typography variant="h6">Mentors</Typography>
			<Grid item xs={12}>
				<Typography>Mentor</Typography>
				<Typography>{profile.Mentor}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>Co-mentor</Typography>
				<Typography>{profile.Co_mentor}</Typography>
			</Grid>
			<Typography variant="h6">Links</Typography>
			<Grid item xs={12}>
				<Typography>Blog</Typography>
				<Typography>{profile.Blog}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>Gantt Chart</Typography>
				<Typography>{profile.Gantt_chart}</Typography>
			</Grid>
		</Grid>
	);
};
