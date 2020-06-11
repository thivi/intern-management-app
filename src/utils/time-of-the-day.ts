export const findTimeOfTheDay = () => {
	const hour = new Date().getHours();

	if (hour > 18) return "Evening";
	if (hour > 12) return "Afternoon";

	return "Morning";
};
