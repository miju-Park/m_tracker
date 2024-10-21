// See https://kit.svelte.dev/docs/types#app

import type { Timestamp } from 'firebase/firestore';

// for information about these interfaces
declare global {
	interface UserType {
		email: string;
	}
	interface TransactionType {
		id: string;
		userId: string;
		amount: number;
		date: Timestamp;
		description: string;
		type: string;
		category: string;
		subCategory?: string;
		memo?: string;
	}
	interface Config {
		id: string;
		userId: string;
		type: 'income' | 'expense' | 'withdraw';
		category: string;
		subCategory?: string;
		budget: number;
		icon?: string;
		color?: string;
	}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
