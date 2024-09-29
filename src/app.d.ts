// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	interface UserType {
		email: string;
	}
	interface TransactionType {
		userId: string;
		amount: number;
		date: Date;
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
