import React, { ReactElement, useState } from "react";
import { Tabs, Tab, Button } from "@material-ui/core";
import { ProfileTab } from "./intern-profile-tabs";
import { InternInfo } from "../models";

interface InternProfilePropsInterface{
    intern: InternInfo;
    goBack: () => void;
}

export const InternProfile = (props:InternProfilePropsInterface): ReactElement => {
    const [index, setIndex] = useState(0);
    
    const { intern, goBack } = props;

	return (
        <>
            <Button onClick={goBack}>
                Go Back
            </Button>
			<Tabs
				value={index}
				onChange={(event, newIndex: number) => {
					setIndex(newIndex);
				}}
			>
				<Tab label="Profile" />
			</Tabs>

			{index === 0 && <ProfileTab />}
		</>
	);
};
