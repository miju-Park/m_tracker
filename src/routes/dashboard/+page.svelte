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
	import { getDayOfWeek, parseCategoryInfo } from '@/utils';
	import MonthPicker from '@/components/MonthPicker.svelte';
	import type { CitrusProps } from 'lucide-svelte/icons/citrus';
	import InputShortcut from '@/components/InputShortcut.svelte';
	import { Timestamp } from 'firebase/firestore';

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

	const insertDb = async (
		event: CustomEvent<{
			type: string;
			category: string;
			date: string;
			description: string;
			amount: number;
		}>
	) => {
		const data = event.detail;
		await transactionHandlers.add({
			...data,
			userId: user?.uid ?? '',
			date: Timestamp.fromDate(new Date(data.date))
		});
	};

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
				<InputShortcut on:submit={insertDb} />
			</div>
		</div>
		<main class="w-full flex justify-center">
			<div class="inline-flex flex-col">
				<div class="inline-flex flex-col">
					{#if Object.keys($groupedTransations).length > 0}
						{#each Object.keys($groupedTransations) as date}
							<h1 class="dateHeader">
								{dayjs(date).format('MM/DD')} ({getDayOfWeek(new Date(date))})
							</h1>
							<div>
								<ul class="transactions">
									{#each $groupedTransations[date] as transaction}
										{@const categoryInfo = parseCategoryInfo(transaction.category)}
										<li class="transaction">
											<div class="text-start">
												<span
													style={`background-color: ${categoryInfo.color}`}
													class="rounded-lg px-3 py-1 text-black"
												>
													{categoryInfo.icon}
													{categoryInfo.category}
												</span>
											</div>
											<div>{transaction.description}</div>
											<div>{transaction.amount}원</div>
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					{:else}
						<p>No transactions found.</p>
					{/if}
				</div>
				<Button size="icon" class="fixed right-8 bottom-8 rounded-full" on:click={navigateToInput}>
					<Plus />
				</Button>
			</div>
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
		padding: 1rem 5rem;
		width: 100%;
	}
	.headerContainer {
		width: 100%;
	}

	.transactions {
		list-style-type: none;
		padding: 0;
		display: inline-flex;
		margin: 0 auto;
		flex-direction: column;
	}
	.transaction {
		display: grid;
		grid-template-columns: 1fr 2fr 150px;
		grid-auto-flow: row;
		justify-content: space-between;
		border-bottom: 1px solid #ccc;
		padding: 10px 0;
	}
</style>
