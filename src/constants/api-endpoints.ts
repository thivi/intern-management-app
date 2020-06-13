export const spreadSheetId = process.env.REACT_APP_SPREADSHEET_ID;

export const apiEndpoints = {
	sheet: `${spreadSheetId}/values`,
	googleProfile: "https://www.googleapis.com/oauth2/v3/userinfo?alt=json",
};
