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
