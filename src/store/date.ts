import { Timestamp } from 'firebase/firestore';
import { derived, writable } from 'svelte/store';
import { getTargetDate } from './utils';

// 2024년 12월 인경우, year:2024, month:12
export const dateStore = writable<{ year: number; month: number }>(getTargetDate());

export const previousMonth = derived(dateStore, ($dateStore) => {
	return {
		year: $dateStore.month === 1 ? $dateStore.year - 1 : $dateStore.year,
		month: $dateStore.month === 1 ? 12 : $dateStore.month - 1
	};
});

export const dateFilter = derived(dateStore, ($dateStore) => {
	return {
		startTime: Timestamp.fromDate(
			new Date(
				`${
					$dateStore.month === 1 ? $dateStore.year - 1 : $dateStore.year
				}-${$dateStore.month === 0 ? 12 : $dateStore.month - 1}-25`
			)
		),
		endTime: Timestamp.fromDate(new Date($dateStore.year, $dateStore.month - 1, 24))
	};
});

export const prevDateFilter = derived(previousMonth, ($previousMonth) => {
	return {
		startTime: Timestamp.fromDate(
			new Date(
				`${
					$previousMonth.month === 1 ? $previousMonth.year - 1 : $previousMonth.year
				}-${$previousMonth.month === 0 ? 12 : $previousMonth.month - 1}-25`
			)
		),
		endTime: Timestamp.fromDate(new Date($previousMonth.year, $previousMonth.month - 1, 24))
	};
});
