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
	where,
	type DocumentData
} from 'firebase/firestore';
import { derived, writable } from 'svelte/store';

export const transactionStore = writable<TransactionType[]>([]);

export const transactionHandlers = {
	getAll: async (userId: string, year: number, month: number) => {
		const transactionsRef = collection(db, 'transactions');
		const q = query(
			transactionsRef,
			// where('userId', '==', userId),
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
export const groupedTransations = derived(transactionStore, ($transactionStore) => {
	return $transactionStore.reduce(
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
});
