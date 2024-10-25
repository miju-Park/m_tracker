import { Timestamp } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { transactionFilter } from './transaction';

export function createUniqueStore<T extends { id: string }>(initialValue: Array<T> = []) {
	const { subscribe, set, update } = writable(initialValue);

	return {
		subscribe,
		set,
		update,
		addUnique: (newItems: Array<T>) => {
			update((items) => {
				const uniqueNewItems = newItems.filter(
					(newItem) => !items.some((existingItem) => existingItem.id === newItem.id)
				);
				return [...items, ...uniqueNewItems];
			});
		}
	};
}

export const setDateSearchFilter = (year: number, month: number) => {
	const startDate = Timestamp.fromDate(
		new Date(month === 1 ? `${year - 1}-12-25` : `${year}-${month - 1}-25`)
	);
	const endDate = Timestamp.fromDate(new Date(`${year}-${month}-24`));
	transactionFilter.set({
		startDate,
		endDate
	});
};

//기준 날짜 기준으로 대상 월 지정
export const getTargetDate = (date: Date = new Date()) => {
	if (date.getDate() >= 25) {
		const isLastMonth = date.getMonth() === 11;
		return {
			year: isLastMonth ? date.getFullYear() + 1 : date.getFullYear(),
			month: isLastMonth ? 1 : date.getMonth() + 2
		};
	}
};
