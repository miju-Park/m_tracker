<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '../../store/store';
	import {
		groupedTransations,
		transactionHandlers,
		transactionStore
	} from '../../store/transaction';
	import type { User } from 'firebase/auth';
	import { Plus, ScanSearch } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import { getDayOfWeek, parseCategoryInfo } from '@/utils';
	import MonthPicker from '@/components/MonthPicker.svelte';
	import InputShortcut from '@/components/InputShortcut.svelte';
	import { Timestamp } from 'firebase/firestore';
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import Summary from '@/components/Summary.svelte';
	import { dateStore } from '../../store/date';
	import { configStore } from '../../store/configStore';

	let user: User | null;
	let year: number;
	let month: number;
	let configList: Config[] = [];
	let transactionLists: Record<string, TransactionType[]> = {};

	const fetchTransaction = async (userId: string, year: number | null, month: number | null) => {
		if (userId && year && month) {
			const transactions = await transactionHandlers.getAll(userId, year, month);
			transactionStore.addUnique(transactions);
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

	async function deleteTransaction(transactionId: string) {
		if (user?.uid) {
			await transactionHandlers.remove(transactionId);
			transactionStore.update((cur) => cur.filter((v) => v.id !== transactionId));
		}
	}

	function navigateToInput() {
		goto('/input');
	}

	const unsubscribeDate = dateStore.subscribe((cur) => {
		(year = cur.year), (month = cur.month);
	});

	const unsubscribe = authStore.subscribe(async (curr) => {
		try {
			user = curr.user;
			if (user) {
				fetchTransaction(user?.uid ?? '', year, month);
			}
		} catch (error) {
			console.log('Error authStore subscribe');
			console.error(error);
		}
	});

	const unsubConfig = configStore.subscribe((cur) => {
		configList = cur;
	});

	// 날짜 기준으로 grouping
	const unsubTransaction = groupedTransations.subscribe((cur) => {
		transactionLists = cur;
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

		// Re-fetch transactions after inserting new data
		await fetchTransaction(user?.uid ?? '', year, month);
	};

	onMount(() => {
		return () => {
			unsubscribe();
			unsubscribeDate();
			unsubConfig();
			unsubTransaction();
		};
	});
</script>

{#if !$authStore.loading}
	<div class="mainContainer">
		<div class="headerContainer">
			<div class="flex gap-2 bg-[#1abc9c] items-center justify-center">
				<MonthPicker on:monthChange={handleMonthChange} {year} {month} />
				<div class="w-[1px] h-full bg-white" />
				<Summary />
			</div>
			<div class="flex justify-center hide-on-mobile">
				<InputShortcut on:submit={insertDb} />
			</div>
		</div>
		<main class="w-full listContainer">
			{#if Object.keys(transactionLists).length > 0}
				<Table class="bg-transparent" noborder>
					{#each Object.keys(transactionLists) as date}
						<h1 class="dateHeader">
							{dayjs(date).format('MM/DD')} ({getDayOfWeek(new Date(date))})
						</h1>
						<TableBody tableBodyClass="bg-transparent">
							{#each transactionLists[date] as transaction}
								{@const categoryInfo = parseCategoryInfo(configList, transaction.category)}
								<TableBodyRow class="bg-transparent py-7 relative rounded group hover:bg-[#000A5A]">
									<TableBodyCell>
										<Button
											class="p-2 px-4 rounded-3xl whitespace-nowrap mr-2 my-auto"
											style={`background-color: ${categoryInfo.color}`}
											on:click={() => {
												goto('/report');
											}}
										>
											{categoryInfo.icon}
											{transaction.category}
										</Button>
									</TableBodyCell>
									<TableBodyCell class="text-white">{transaction.description || ''}</TableBodyCell>
									<TableBodyCell class="text-white"
										>{Number(transaction.amount)?.toLocaleString()}원</TableBodyCell
									>

									<button
										class="delete-button group-hover:block"
										on:click={() => deleteTransaction(transaction.id)}>삭제</button
									>
								</TableBodyRow>
							{/each}
						</TableBody>
					{/each}
				</Table>
			{:else}
				<div class="flex flex-col justify-center items-center w-full h-full text-lg gap-4">
					<ScanSearch color="white" size={24} />
					No Results
				</div>
			{/if}

			<Button
				size="icon"
				class="fixed right-8 bottom-8 rounded-full bg-[#1abc9c] hover:bg-[#12836d]"
				on:click={navigateToInput}
			>
				<Plus />
			</Button>
		</main>
	</div>
{:else}
	<p>??</p>
{/if}

<style>
	.mainContainer {
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: auto;
		scrollbar-gutter: stable; /* Reserves space for the scrollbar */
	}

	.dateHeader {
		margin-top: 20px;
	}

	.headerContainer {
		width: 100%;
		padding: 0rem 5rem;
	}

	.listContainer {
		padding: 0rem 12rem;
		flex: 1;
	}
	@media (max-width: 768px) {
		.listContainer {
			padding: 0rem 2rem;
		}
	}

	.delete-button {
		display: none;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		background-color: red;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 5px 10px;
		cursor: pointer;
	}

	/* 새로운 스타일 추가 */
	@media (max-width: 768px) {
		.hide-on-mobile {
			display: none;
		}
	}
</style>
