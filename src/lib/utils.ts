import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const getDayOfWeek = (date: Date) => {
	const days = ['일', '월', '화', '수', '목', '금', '토'];
	const dayIndex = dayjs(date).day();
	return days[dayIndex];
};

export const parseCategoryInfo = (configLists: Config[], inputStr: string) => {
	const bracketPattern = /^\[([^\]]+)\]/;
	const plainPattern = /^([^[\s]+(?:\s+[^[\s]+)*)/;
	let category = '';
	let match = inputStr.match(bracketPattern);
	if (match) {
		category = match[1];
	}

	match = inputStr.match(plainPattern);
	if (match) {
		category = match[1];
	}
	return {
		category,
		icon: configLists.find((v) => v.category === category)?.icon ?? '',
		color: configLists.find((v) => v.category === category)?.color ?? ''
	};
};
