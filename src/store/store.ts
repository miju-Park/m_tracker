import { auth } from '$lib/firebase/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	type User
} from 'firebase/auth';
import { writable } from 'svelte/store';

export const authStore = writable<{
	user: User | null;
	loading: boolean;
	data: Record<string, any>;
}>({
	user: null,
	loading: true,
	data: {}
});
export const authHandler = {
	signup: async (email: string, password: string) => {
		return await createUserWithEmailAndPassword(auth, email, password);
	},
	login: async (email: string, password: string) => {
		return await signInWithEmailAndPassword(auth, email, password);
	},
	logout: async () => {
		return await signOut(auth);
	}
};
