import { useState, useEffect } from "react";
import { NetworkRequestMessage } from "../models";

export const useProgressLoader = (): number => {
	const [progress, setProgress] = useState<Map<string, boolean>>(new Map());
	const [loading, setLoading] = useState(false);
	const [percent, setPercent] = useState(0);

	useEffect(() => {
		if (loading && percent === 0) {
			setPercent(1);
			setTimeout(() => {
				setPercent(50);
			}, 500);
		} else if (!loading && percent === 50) {
			setPercent(100);
			setTimeout(() => {
				setPercent(0);
			}, 1000);
		}
	}, [loading, percent]);

	const resetProgress = () => {
		setProgress(new Map());
	};

	useEffect(() => {
		if (progress.size > 0) {
			let isLoading = false;
			progress.forEach((value: boolean) => {
				if (value) {
					isLoading = true;
				}
			});

			if (!isLoading) {
				setLoading(false);
				resetProgress();
			}
		}
	}, [progress]);

	onmessage = ({ data }: { data: NetworkRequestMessage }) => {
		if (data.type === "progress") {
			!loading && data.loading && setLoading(true);

			const temp = new Map(progress);
			temp.set(data.id, data.loading);
			setProgress(temp);
		}
	};

	return percent;
};
