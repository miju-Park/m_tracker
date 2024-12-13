<script lang="ts">
	import type { User } from 'firebase/auth';
	import { configStore } from '../../store/configStore';
	import { transactionHandlers } from '../../store/transaction';
	import { authStore } from '../../store/store';
	import { onMount } from 'svelte';
	import { Timestamp } from 'firebase/firestore';
	import { itemData } from './data';

	let configList: Config[] = [];
	let user: User | null;

	const unsubConfig = configStore.subscribe((cur) => {
		configList = cur;
	});
	const unsubscribe = authStore.subscribe(async (curr) => {
		try {
			user = curr.user;
		} catch (error) {
			console.error(error);
		}
	});

	const insertDb = async (data: {
		type: string;
		category: string;
		date: string;
		description: string;
		amount: number;
	}) => {
		await transactionHandlers.add({
			...data,
			userId: user?.uid ?? '',
			date: Timestamp.fromDate(new Date(data.date))
		});
	};
	const processImport = async () => {
		for await (const item of itemData) {
			const { description, date, type, amount, category } = item;

			await insertDb({
				description,
				date,
				type,
				amount,
				category
			});
		}
	};
	onMount(() => {
		return () => {
			unsubConfig();
			unsubscribe();
		};
	});
</script>

<button on:click={processImport}>Import</button>
