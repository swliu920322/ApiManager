export function throttle(func: (...arg: any[]) => any, delay = 400) {
	let timer: number = null;
	return (...args: any[]) => {
		if (!timer) {
			func(...args);
			timer = setTimeout(() => {
				timer = null;
			}, delay);
		}
	};
}

export function debounce(func: (...arg: any[]) => any, delay = 400) {
	let timer: number;
	return (...args: any[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(args);
		}, delay);
	};
}

export function getPartiFromProps(props: Record<string, any>, keys: string[]) {
	return keys.reduce((r, c) => {
		return {
			...r,
			[c]: props[c]
		};
	}, {});
}
