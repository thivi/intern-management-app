import { TimeOfTheDay } from "../models";

export const findTimeOfTheDay = (): TimeOfTheDay => {
	const hour = new Date().getHours();

	if (hour > 19)
		return {
			text: "Evening",
			image: "night",
		};
	if (hour > 16)
		return {
			text: "Evening",
			image: "evening",
		};
	if (hour > 12)
		return {
			text: "Afternoon",
			image: "noon",
		};
	if (hour > 6)
		return {
			text: "Morning",
			image: "morning",
		};

	return {
		text: "Morning",
		image: "night",
	};
};
