import { Timestamp } from 'firebase/firestore';
import { derived, writable } from 'svelte/store';

export const dateStore = writable<{ year: number; month: number }>({
	year: new Date().getFullYear(),
	month: new Date().getMonth() + 1
});

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
				}-${$dateStore.month === 1 ? 12 : $dateStore.month - 1}-25`
			)
		),
		endTime: Timestamp.fromDate(new Date($dateStore.year, $dateStore.month, 24))
	};
});

export const prevDateFilter = derived(previousMonth, ($previousMonth) => {
	return {
		startTime: Timestamp.fromDate(
			new Date(
				`${
					$previousMonth.month === 1 ? $previousMonth.year - 1 : $previousMonth.year
				}-${$previousMonth.month === 1 ? 12 : $previousMonth.month - 1}-25`
			)
		),
		endTime: Timestamp.fromDate(new Date($previousMonth.year, $previousMonth.month, 24))
	};
});
