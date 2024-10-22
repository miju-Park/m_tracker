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
	import { configHandler, configStore } from '../../store/configStore';
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import Summary from '@/components/Summary.svelte';
	import { dateStore } from '../../store/date';

	let user: User | null;
	let year: number | null;
	let month: number | null;

	const fetchConfig = async (userId: string) => {
		const configInfo = await configHandler.get(userId);
		configStore.set(configInfo);
	};

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
			// 트랜잭션 삭제 후 목록 다시 불러오기
			await fetchTransaction(user.uid, year, month);
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
				fetchConfig(user?.uid ?? '');
				fetchTransaction(user?.uid ?? '', year, month);
			}
		} catch (error) {
			console.log('Error authStore subscribe');
			console.error(error);
		}
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
		return () => unsubscribe();
	});
</script>

{#if !$authStore.loading}
	<div class="mainContainer">
		<div class="headerContainer">
			<div class="flex gap-2 bg-[#1abc9c] items-center justify-center">
				<MonthPicker on:monthChange={handleMonthChange} />
				<div class="w-[1px] h-full bg-white" />
				<Summary />
			</div>
			<div class="flex justify-center hide-on-mobile">
				<InputShortcut on:submit={insertDb} />
			</div>
		</div>
		<main class="w-full listContainer">
			{#if Object.keys($groupedTransations).length > 0}
				<Table class="bg-transparent" noborder>
					{#each Object.keys($groupedTransations) as date}
						<h1 class="dateHeader">
							{dayjs(date).format('MM/DD')} ({getDayOfWeek(new Date(date))})
						</h1>
						<!-- <table class="transactions-table"> -->
						<TableBody tableBodyClass="bg-transparent">
							{#each $groupedTransations[date] as transaction}
								{@const categoryInfo = parseCategoryInfo(transaction.category)}
								<TableBodyRow class="bg-transparent py-7">
									<TableBodyCell
										><span
											class="p-2 rounded-3xl whitespace-nowrap mr-2 my-auto"
											style={`background-color: ${categoryInfo.color}`}
										>
											{categoryInfo.icon}
											{transaction.category}
										</span>
									</TableBodyCell>
									<TableBodyCell class="text-white">{transaction.description || ''}</TableBodyCell>
									<TableBodyCell class="text-white"
										>{Number(transaction.amount)?.toLocaleString()}원</TableBodyCell
									>

									<button class="delete-button" on:click={() => deleteTransaction(transaction.id)}
										>삭제</button
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
	.transactions-table {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		border-collapse: collapse;
	}

	.transactions-table th,
	.transactions-table td {
		padding: 8px;
		text-align: left;
	}

	.transactions-table th {
		background-color: #f2f2f2;
	}

	@media (max-width: 768px) {
		.transactions-table th,
		.transactions-table td {
			padding: 6px;
			font-size: 14px;
		}
	}
	.dateHeader {
		margin-top: 20px;
	}

	.mainContainer {
		padding: 1rem 0;
		width: 100%;
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
	.transactions {
		list-style-type: none;
		padding: 0;
		display: flex;
		margin: 0 auto;
		flex-direction: column;
	}
	.transaction {
		display: flex;
		position: relative;
		justify-content: space-between; /* 여백 최소화 */
		align-items: center;
		padding: 8px;
		margin: 0 auto; /* 가운데 정렬 */
		width: 80%; /* 화면에 맞게 너비 조정 */
		max-width: 800px; /* 최대 너비 설정 */
	}

	.transaction .category {
		display: flex;
		align-items: center;
		border-radius: 2rem;
		white-space: nowrap; /* 줄바꿈 방지 */
		margin-right: 8px; /* 아이콘과 텍스트 사이의 간격 */
	}

	.transaction .category-icon {
		margin-right: 4px; /* 아이콘과 텍스트 사이의 간격 */
	}
	.delete-button {
		display: none;
		position: absolute;
		right: -2rem;
		top: 50%;
		transform: translateY(-50%);
		background-color: red;
		color: white;
		border: none;
		border-radius: 5px;
		padding: 5px 10px;
		cursor: pointer;
	}
	.transaction:hover .delete-button {
		display: block;
	}

	@media (max-width: 768px) {
		.transaction {
			flex-direction: row;
			align-items: center;
		}
		.transaction div {
			flex: 1;
		}
	}
	/* 새로운 스타일 추가 */
	@media (max-width: 768px) {
		.hide-on-mobile {
			display: none;
		}
	}
</style>
