export const convertKeyToLabel = (text: string): string => {
	const sentenced = text.split("_").join(" ");
	const words = sentenced.split(" ");
	const capitalizedWord: string[] = [];
	words.forEach((word) => {
		const firstLetter = word.substring(0, 1);
		const rest = word.substring(1);

		capitalizedWord.push(firstLetter.toUpperCase() + rest);
	});

	return capitalizedWord.join(" ");
};
