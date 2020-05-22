import React, { ReactElement, useEffect, useState } from "react";
import { getGoogleProfile, getProfile } from "../apis";
import { GoogleProfile, Profile } from "../models";
import { Grid, Avatar, Typography, TextField } from "@material-ui/core";

export const ProfilePage = (): ReactElement => {
	const [googleProfile, setGoogleProfile] = useState<GoogleProfile>(null);
	const [profile, setProfile] = useState<Profile>(null);

	useEffect(() => {
		getGoogleProfile()
			.then((response) => {
				setGoogleProfile(response);
			})
			.catch((error) => {
				//TODO: Notify
			});
	}, []);

	useEffect(() => {
		getProfile()
			.then((response) => {
				const rawProfile = response?.values?.find((value: string[]) => value[0] === googleProfile.email);
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
				//TODO: Notify
			});
	}, [googleProfile]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={4}>
				<Avatar src={googleProfile?.picture} />
			</Grid>
			<Grid item xs={8}>
				<Typography variant="h5">{googleProfile?.name}</Typography>
				<Typography>{googleProfile?.email}</Typography>
			</Grid>
			<Typography variant="h6">Academic Credentials</Typography>
			<Grid item xs={12}>
				<TextField
					name="university"
					placeholder="eg: University of Colombo, University of Moratuwa etc."
					value={profile?.University}
					variant="outlined"
					label="University"
					fullWidth
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					name="degree"
					placeholder="eg: B.Sc. in Information Technology, B.Eng. in Software Engineering etc."
					value={profile?.Degree}
					variant="outlined"
					label="Degree"
					fullWidth
				/>
			</Grid>

			<Typography variant="h6">Internship Period</Typography>
			<Grid item xs={12}>
				<TextField
					name="joined"
					placeholder={"eg: " + new Date().toDateString()}
					value={profile?.Joined_date}
					variant="outlined"
					label="Joined Date"
					fullWidth
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					name="leaving"
					placeholder={"eg: " + new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30 * 6).toDateString()}
					value={profile?.Leaving_date}
					variant="outlined"
					label="Leaving Date"
					fullWidth
				/>
            </Grid>
            
            <Typography variant="h6">Contacts</Typography>
			<Grid item xs={12}>
				<TextField
					name="contact"
					placeholder="eg: 077756896532"
					value={profile?.Contact_no}
					variant="outlined"
					label="Contact Number"
					fullWidth
				/>
            </Grid>
            
            <Typography variant="h6">Mentors</Typography>
			<Grid item xs={12}>
				<TextField
					name="mentor"
					placeholder="eg: John Doe"
					value={profile?.Mentor}
					variant="outlined"
					label="Mentor"
					fullWidth
				/>
            </Grid>
            <Grid item xs={12}>
				<TextField
					name="coMentor"
					placeholder="eg: John Doe"
					value={profile?.Co_mentor}
					variant="outlined"
					label="Co-Mentor"
					fullWidth
				/>
            </Grid>
            
            <Typography variant="h6">Links</Typography>
			<Grid item xs={12}>
				<TextField
					name="blog"
					placeholder="eg: https://www.thearmchaircritic.org"
					value={profile?.Blog}
					variant="outlined"
					label="Blog Link"
					fullWidth
				/>
            </Grid>
            <Grid item xs={12}>
				<TextField
					name="ganttChart"
					placeholder="eg: https://docs.google.com/..."
					value={profile?.Gantt_chart}
					variant="outlined"
					label="Link to Gantt Chart"
					fullWidth
				/>
			</Grid>
		</Grid>
	);
};
