<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/firebase/firebase';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import '../app.css';
	import { onMount } from 'svelte';
	import { authStore } from '../store/store';
	import type { User } from 'firebase/auth';

	const nonAuthPaths = ['/'];

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
			const currentPath = window.location.pathname;
			if (!user && !nonAuthPaths.includes(currentPath)) {
				goto('/');
				return;
			}

			if (!user) {
				return;
			}
			try {
				let dataToSetToStore: { email: string } | null = null;
				const docRef = doc(db, 'users', user.uid);
				const docSnap = await getDoc(docRef);
				if (!docSnap.exists()) {
					console.log('create user');
					const userRef = doc(db, 'users', user.uid);
					dataToSetToStore = {
						email: user.email || ''
					};
					await setDoc(userRef, dataToSetToStore, { merge: true });
				} else {
					console.log('Fetching User');
					dataToSetToStore = docSnap.data() as { email: string };
				}
				authStore.update((cur) => {
					return {
						...cur,
						user,
						loading: false,
						data: dataToSetToStore
					};
				});
				if (user && currentPath === '/') {
					goto('/dashboard');
					return;
				}
			} catch (error) {
				console.error('Error in onAuthStateChanged:', error);
				// Handle the error appropriately
			}
		});
		return unsubscribe;
	});
</script>

<div
	class="min-h-screen bg-gradient-to-r from-[#000428] to-[#000046] text-white flex flex-col relative"
>
	<slot />
</div>
