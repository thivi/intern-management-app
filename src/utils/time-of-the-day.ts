import { TimeOfTheDay } from "../models";

export const findTimeOfTheDay = (): TimeOfTheDay => {
	const hour = new Date().getHours();

	if (hour > 18)
		return {
			text: "Evening",
			image: "night",
		};
	if (hour > 15)
		return {
			text: "Evening",
			image: "evening",
		};
	if (hour > 11)
		return {
			text: "Afternoon",
			image: "noon",
		};
	if (hour > 5)
		return {
			text: "Morning",
			image: "morning",
		};

	return {
		text: "Morning",
		image: "night",
	};
};
