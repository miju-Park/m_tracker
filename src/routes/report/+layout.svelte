<script lang="ts">
	import MonthPicker from '@/components/MonthPicker.svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { authStore } from '../../store/store';
	import { configStore } from '../../store/configStore';
	import type { User } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { transactionHandlers, transactionStore } from '../../store/transaction';
	import { dateStore, previousMonth } from '../../store/date';
	import { get } from 'svelte/store';

	let user: User | null;
	let config: Config[];
	let year: number;
	let month: number;

	const fetchTransaction = async (userId: string, year: number, month: number) => {
		if (userId && year && month) {
			const transactions = await transactionHandlers.getAll(userId, year, month);
			transactionStore.addUnique(transactions);
			const prevTransactions = await transactionHandlers.getAll(
				userId,
				get(previousMonth).year,
				get(previousMonth).month
			);
			transactionStore.addUnique(prevTransactions);
		}
	};

	const handleMonthChange = (event: CustomEvent<{ month: number; year: number }>) => {
		const year = event.detail.year;
		const month = event.detail.month;
		dateStore.set({
			year,
			month
		});
		fetchTransaction(user?.uid ?? '', year, month);
	};

	const unsubDate = dateStore.subscribe((cur) => {
		year = cur.year;
		month = cur.month;
	});

	const unsubscribeUser = authStore.subscribe((cur) => {
		user = cur.user;
	});

	const unsubscribeConfig = configStore.subscribe(async (curr) => {
		config = curr;
	});

	onMount(() => {
		return () => {
			unsubDate();
			unsubscribeConfig();
			unsubscribeUser();
		};
	});
</script>

<MonthPicker {year} {month} on:monthChange={handleMonthChange} />
<Tabs tabStyle="underline">
	<TabItem open title="Income"></TabItem>
	<TabItem title="Expense"></TabItem>
	<TabItem title="Withdraw"></TabItem>
</Tabs>
<slot {year} {month} />
