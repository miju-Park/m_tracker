<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { dateFilter, dateStore, prevDateFilter } from '../../../store/date';
	import { onMount } from 'svelte';
	import { expenseCategories } from '../../../store/configStore';
	import { transactionStore } from '../../../store/transaction';
	import UsageCell from './UsageCell.svelte';
	import * as Table from '$lib/components/ui/table';
	import PieChart from '../../../components/PieChart.svelte';

	let year: number;
	let month: number;

	const unsubDate = dateStore.subscribe((cur) => {
		year = cur?.year;
		month = cur?.month;
	});

	/**
	 * 카테고리 항목별 예산, 실제 소비금액 계산
	 */
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

	/**
	 * 실제 소비금액을 대분류 카테고리 기준으로 Grouping >> pie chart 표시용
	 */
	const groupedByCategory = derived([expenseSummaries], ([summary]) => {
		const result = summary.reduce(
			(acc, cur) => {
				const category = cur.category.split(']')[0].slice(1);
				return {
					...acc,
					[category]: {
						color: cur.color,
						amount: (acc?.[category]?.amount ?? 0) + cur.amount
					}
				};
			},
			{} as Record<string, { amount: number; color?: string }>
		);
		return Object.keys(result)
			.map((k) => ({
				label: k,
				value: result[k].amount,
				color: result[k].color ?? 'black'
			}))
			.filter((v) => v.value > 0);
	});

	const familyEventEvent = (data: (typeof $expenseSummaries)[number]) => {
		return (
			data.category.includes('부모님') ||
			data.category === '[교통] 기차' ||
			data.category === '[경조사] 경조사'
		);
	};
	const comsumptionCategory = (data: (typeof $expenseSummaries)[number]) => {
		switch (data.category) {
			case '[건강] 건강식품':
			case '[건강] 약국':
			case '[건강] 병원':
			case '[건강] 건강식품':
			case '[경조사] 선물':
			case '[교통] 대중교통':
			case '[교통] 자동차관련':
			case '[교통] 택시':
			case '[교통] 주유':
			case '[문화생활] 여행':
			case '[문화생활] 문화생활':
			case '[생필품] 생필품':
			case '[생필품] 자동차용품':
			case '[식비] 술, 유흥':
			case '[식비] 마트, 장보기':
			case '[식비] 배달, 외식':
			case '[식비] 카페':
			case '[패션/미용] 의류':
			case '[패션/미용] 헤어/뷰티':
			case '[패션/미용] 세탁비':
				return true;
			default:
				return false;
		}
	};

	const extraSummary = derived([expenseSummaries], ([summary]) => {
		return summary.reduce(
			(iter, cur) => {
				//경조사비
				if (familyEventEvent(cur)) {
					return {
						...iter,
						familyEvent: iter.familyEvent + (cur.budget - cur.amount)
					};
				} else if (comsumptionCategory(cur)) {
					return {
						...iter,
						consumption: iter.consumption + (cur.budget - cur.amount)
					};
				} else {
					return iter;
				}
			},
			{
				familyEvent: 0,
				consumption: 0
			}
		);
	});

	onMount(() => {
		return () => {
			unsubDate();
		};
	});
</script>

<div class="px-10 py-4 gap-2 grid grid-cols-1 items-start sm:grid-cols-[7fr_3fr]">
	<Table.Root>
		<Table.Caption>Track your monthly expenses and budget</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Category</Table.Head>
				<Table.Head>Spent</Table.Head>
				<Table.Head>Budget</Table.Head>
				<Table.Head class="text-right">Usage</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $expenseSummaries as summary}
				<Table.Row>
					<Table.Cell>{summary.icon} {summary.category}</Table.Cell>
					<Table.Cell>{summary.amount.toLocaleString()}</Table.Cell>
					<Table.Cell>{summary.budget.toLocaleString()}</Table.Cell>
					<Table.Cell class="text-right">
						<UsageCell budget={summary.budget} amount={summary.amount} />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Footer>
			<Table.Row>
				<Table.Cell class="text-right" colspan={2}>저축금액(to 소비통장)</Table.Cell>
				<Table.Cell colspan={2}>{$extraSummary.consumption.toLocaleString()}원</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell class="text-right" colspan={2}>저축금액(to 경조사통장)</Table.Cell>
				<Table.Cell colspan={2}>{$extraSummary.familyEvent.toLocaleString()}원</Table.Cell>
			</Table.Row>
		</Table.Footer>
	</Table.Root>
	<!-- Pie charts -->
	<PieChart data={$groupedByCategory} />
</div>
