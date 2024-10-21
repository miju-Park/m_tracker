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
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import { getDayOfWeek, parseCategoryInfo } from '@/utils';
	import MonthPicker from '@/components/MonthPicker.svelte';
	import InputShortcut from '@/components/InputShortcut.svelte';
	import { Timestamp } from 'firebase/firestore';
	import { configHandler, configStore } from '../../store/configStore';

	let user: User | null;
	let year = new Date().getFullYear();
	let month = new Date().getMonth() + 1;

	const fetchConfig = async (userId: string) => {
		const configInfo = await configHandler.get(userId);
		configStore.set(configInfo);
	};

	const fetchTransaction = async (userId: string, year: number, month: number) => {
		if (userId && year && month) {
			const transactions = await transactionHandlers.getAll(userId, year, month);
			transactionStore.set(transactions);
		}
	};
	const handleMonthChange = (event: CustomEvent<{ month: number; year: number }>) => {
		year = event.detail.year;
		month = event.detail.month;
		transactionStore.set([]);
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
			<MonthPicker on:monthChange={handleMonthChange} />
			<div class="flex justify-center hide-on-mobile">
				<InputShortcut on:submit={insertDb} />
			</div>
		</div>
		<main class="w-full listContainer">
			<div class="flex flex-col">
				<div class="flex flex-col">
					{#if Object.keys($groupedTransations).length > 0}
						{#each Object.keys($groupedTransations) as date}
							<h1 class="dateHeader">
								{dayjs(date).format('MM/DD')} ({getDayOfWeek(new Date(date))})
							</h1>
							<div>
								<table class="transactions-table">
									<tbody>
										{#each $groupedTransations[date] as transaction}
											{@const categoryInfo = parseCategoryInfo(transaction.category)}
											<tr class="transaction">
												<td class="category" style={`background-color: ${categoryInfo.color}`}>
													{categoryInfo.icon}
													{transaction.category}
												</td>
												<td>{transaction.description || ''}</td>
												<td>{Number(transaction.amount)?.toLocaleString()}원</td>

												<button
													class="delete-button"
													on:click={() => deleteTransaction(transaction.id)}>삭제</button
												>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						{/each}
					{:else}
						<p>No transactions found.</p>
					{/if}
				</div>
				<Button
					size="icon"
					class="fixed right-8 bottom-8 rounded-full bg-[#1abc9c] hover:bg-[#12836d]"
					on:click={navigateToInput}
				>
					<Plus />
				</Button>
			</div>
		</main>
	</div>
{:else}
	<p>??</p>
{/if}

<style>
	.mainContainer {
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
