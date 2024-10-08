<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '../../store/store';
	import {
		groupedTransations,
		transactionHandlers,
		transactionStore
	} from '../../store/transaction';
	import type { User } from 'firebase/auth';
	import { Plus } from 'lucide-svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@/components/ui/table';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import { getDayOfWeek } from '@/utils';
	import MonthPicker from '@/components/MonthPicker.svelte';
	import type { CitrusProps } from 'lucide-svelte/icons/citrus';
	import InputShortcut from '@/components/InputShortcut.svelte';

	let user: User | null;
	let year = new Date().getFullYear();
	let month = new Date().getMonth() + 1;

	const fetchTransaction = async (userId: string, year: number, month: number) => {
		if (userId && year && month) {
			console.log('---fetch---', year, month);
			const transactions = await transactionHandlers.getAll(userId, year, month);
			transactionStore.set(transactions);
		}
	};
	const handleMonthChange = (event: CustomEvent<{ month: number; year: number }>) => {
		year = event.detail.year;
		month = event.detail.month;
		fetchTransaction(user?.uid ?? '', year, month);
	};

	function navigateToInput() {
		goto('/input');
	}

	const unsubscribe = authStore.subscribe(async (curr) => {
		user = curr.user;
		fetchTransaction(user?.uid ?? '', year, month);
	});

	onMount(() => {
		return () => unsubscribe();
	});
</script>

{#if !$authStore.loading}
	<div class="mainContainer">
		<div class="headerContainer">
			<h1>가계부 내역</h1>
			<MonthPicker on:monthChange={handleMonthChange} />
			<div class="flex justify-center">
				<InputShortcut />
			</div>
			<!-- <div class="headerBtns">
				<button on:click={saveTodos}>
					<i class="fa-regular fa-floppy-disk" />
					<p>Save</p></button
				>
				<button on:click={authHandler.logout}>
					<i class="fa-solid fa-right-from-bracket" />
					<p>Logout</p></button
				>
			</div> -->
		</div>
		<main>
			<div class="transaction-table">
				<h2>Transactions</h2>
				{#if Object.keys($groupedTransations).length > 0}
					{#each Object.keys($groupedTransations) as date}
						<h1 class="dateHeader">
							{dayjs(date).format('MM/DD')} ({getDayOfWeek(new Date(date))})
						</h1>
						<ul class="transactions">
							{#each $groupedTransations[date] as transaction}
								<li class="transaction">
									<div>{dayjs(transaction.date.toDate()).format('YYYY-MM-DD')}</div>
									<div>{transaction.description}</div>
									<div>{transaction.amount}원</div>
								</li>
							{/each}
						</ul>
					{/each}
				{:else}
					<p>No transactions found.</p>
				{/if}
			</div>
			<Button size="icon" class="fixed right-8 bottom-8 rounded-full" on:click={navigateToInput}>
				<Plus />
			</Button>
		</main>
	</div>
{:else}
	<p>??</p>
{/if}

<style>
	.dateHeader {
		margin-top: 20px;
	}

	.mainContainer {
		padding: 20px 40px;
	}

	.transactions {
		list-style-type: none;
		margin: 0 20px;
	}
	.transaction {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #ccc;
		padding: 10px 0;
	}
</style>
