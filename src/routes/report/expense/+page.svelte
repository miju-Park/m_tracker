<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { dateFilter, dateStore, prevDateFilter } from '../../../store/date';
	import { onMount } from 'svelte';
	import { expenseCategories } from '../../../store/configStore';
	import { transactionStore } from '../../../store/transaction';
	import UsageCell from './UsageCell.svelte';
	import * as Table from '$lib/components/ui/table';

	let year: number;
	let month: number;

	const unsubDate = dateStore.subscribe((cur) => {
		year = cur?.year;
		month = cur?.month;
	});

	const expenseSummaries = derived(
		[transactionStore, dateFilter, expenseCategories],
		([$transactionStore, $dateFilter, $expenseCategories]) => {
			const expenseDefaultValue = $expenseCategories
				.sort((a, b) => {
					return a.category.localeCompare(b.category);
				})
				.map((cur) => {
					return {
						category: `[${cur.category}] ${cur.subCategory}`,
						icon: cur.icon,
						color: cur.color,
						amount: 0,
						budget: cur?.budget ?? 0
					};
				});

			return $transactionStore
				.filter(
					(v) =>
						v.type === 'expense' && v.date <= $dateFilter.endTime && v.date >= $dateFilter.startTime
				)
				.reduce((acc, cur) => {
					return acc.map((a) =>
						a.category === cur.category
							? {
									...a,
									amount: cur.amount + a.amount
								}
							: a
					);
				}, expenseDefaultValue);
		}
	);

	
	onMount(() => {
		return () => {
			unsubDate();
		};
	});
</script>

<div class="px-10 py-4 flex flex-col">
	<Table.Root>
		<Table.Caption>Track your monthly expenses and budget</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Category</Table.Head>
				<Table.Head>Spent</Table.Head>
				<Table.Head>Bedget</Table.Head>
				<Table.Head class="text-right">Usage</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $expenseSummaries as summary}
				<Table.Row>
					<Table.Cell>{summary.icon} {summary.category}</Table.Cell>
					<Table.Cell>{summary.amount}</Table.Cell>
					<Table.Cell>{summary.budget}</Table.Cell>
					<Table.Cell class="text-right">
						<UsageCell budget={summary.budget} amount={summary.amount} />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
