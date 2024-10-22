import { derived, writable } from 'svelte/store';

export const dateStore = writable<{ year: number; month: number }>({
	year: new Date().getFullYear(),
	month: new Date().getMonth() - 1
});

export const previousMonth = derived(dateStore, ($dateStore) => {
	return {
		year: $dateStore.month === 1 ? $dateStore.year - 1 : $dateStore.year,
		month: $dateStore.month === 1 ? 12 : $dateStore.month - 1
	};
});
