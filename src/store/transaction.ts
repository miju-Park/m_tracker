import { db } from '$lib/firebase/firebase';
import dayjs from 'dayjs';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	QueryDocumentSnapshot,
	setDoc,
	Timestamp,
	where,
	type DocumentData
} from 'firebase/firestore';
import { derived, writable } from 'svelte/store';
import { createUniqueStore, setDateSearchFilter } from './utils';

export const transactionStore = createUniqueStore<TransactionType>();
export const transactionFilter = writable<{ startDate: Timestamp; endDate: Timestamp }>();

export const transactionHandlers = {
	getAll: async (userId: string, year: number, month: number) => {
		const transactionsRef = collection(db, 'transactions');
		setDateSearchFilter(year, month);
		const startDate = Timestamp.fromDate(
			new Date(month === 1 ? `${year - 1}-12-25` : `${year}-${month - 1}-25`)
		);
		const endDate = Timestamp.fromDate(new Date(`${year}-${month}-24`));

		const q = query(
			transactionsRef,
			where('userId', '==', userId),
			where('date', '>=', startDate),
			where('date', '<=', endDate),
			orderBy('date', 'desc')
		);

		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				({
					id: doc.id,
					...doc.data()
				}) as TransactionType
		);
	},
	getAllByRange: async (userId: string, start_date: Date, end_date: Date) => {
		const transactionsRef = collection(db, 'transactions');
		const startDate = Timestamp.fromDate(start_date);
		const endDate = Timestamp.fromDate(end_date);
		console.log('startDate', start_date);
		console.log('endDate', end_date);

		const q = query(
			transactionsRef,
			where('userId', '==', userId),
			where('date', '>=', startDate),
			where('date', '<=', endDate),
			orderBy('date', 'desc')
		);

		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				({
					id: doc.id,
					...doc.data()
				}) as TransactionType
		);
	},
	add: async (transaction: Omit<TransactionType, 'id'>) => {
		const docRef = doc(collection(db, 'transactions'));
		await setDoc(docRef, transaction);
	},
	remove: async (transactionId: string) => {
		const docRef = doc(db, 'transactions', transactionId);
		await deleteDoc(docRef);
	}
};
// 날짜 기준으로 transaction grouping
export const groupedTransations = derived(
	[transactionStore, transactionFilter],
	([$transactionStore, $transactionFilter]) => {
		return $transactionStore
			.filter((v) => v.date <= $transactionFilter.endDate && v.date >= $transactionFilter.startDate)
			.reduce(
				(groups, transaction) => {
					const date = transaction.date.toDate();
					const dateString = dayjs(date).format('YYYY-MM-DD');
					if (!groups[dateString]) {
						groups[dateString] = [];
					}
					groups[dateString].push(transaction);
					return groups;
				},
				{} as { [key: string]: TransactionType[] }
			);
	}
);
// 해당 월의 수입/지출 총합
export const summariedTransactions = derived(
	[transactionStore, transactionFilter],
	([$transactionStore, $transactionFilter]) => {
		return $transactionStore
			.filter((v) => v.date <= $transactionFilter.endDate && v.date >= $transactionFilter.startDate)
			.reduce(
				(iter, cur) => {
					if (cur.type === 'income') {
						return { ...iter, income: iter.income + Number(cur.amount) };
					} else if (cur.type === 'expense') {
						return {
							...iter,
							expense: iter.expense + Number(cur.amount)
						};
					} else if (cur.type === 'withdraw') {
						return {
							...iter,
							withdraw: iter.withdraw + Number(cur.amount)
						};
					}
					return iter;
				},
				{
					income: 0,
					expense: 0,
					withdraw: 0
				}
			);
	}
);
