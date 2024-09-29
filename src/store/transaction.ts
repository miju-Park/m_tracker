import { db } from '$lib/firebase/firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { writable } from 'svelte/store';

export const transactionStore = writable<TransactionType[]>([]);

export const transactionHandlers = {
	getAll: async (userId: string) => {
		const q = query(collection(db, 'transactions'));
		return await getDocs<any, TransactionType>(q);
	},
	add: async (transaction: TransactionType) => {
		const docRef = doc(collection(db, 'transactions'));
		await setDoc(docRef, transaction);
	}
};
