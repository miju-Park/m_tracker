import { db } from '$lib/firebase/firebase';
import {
	collection,
	getDocs,
	query,
	QueryDocumentSnapshot,
	where,
	type DocumentData
} from 'firebase/firestore';

import { derived, writable } from 'svelte/store';

export const configStore = writable<Config[]>([]);
export const configHandler = {
	get: async (userId: string) => {
		const transactionsRef = collection(db, 'categories');
		const q = query(transactionsRef, where('userId', '==', userId));
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				({
					id: doc.id,
					...doc.data()
				}) as Config
		);
	}
};

export const expenseCategories = derived(configStore, ($configStore) => {
	return $configStore.filter((v) => v.type === 'expense');
});

export const incomeCategories = derived(configStore, ($configStore) => {
	return $configStore.filter((v) => v.type === 'income');
});

export const withdrawCategories = derived(configStore, ($configStore) => {
	return $configStore.filter((v) => v.type === 'withdraw');
});
