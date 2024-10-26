<script lang="ts">
	import { derived } from 'svelte/store';
	import { dateFilter, dateStore, prevDateFilter } from '../../../store/date';
	import { onMount } from 'svelte';
	import { incomeCategories } from '../../../store/configStore';
	import { transactionStore } from '../../../store/transaction';
	import {
		Chart,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	let year: number;
	let month: number;

	const unsubDate = dateStore.subscribe((cur) => {
		year = cur?.year;
		month = cur?.month;
	});

	// 이번달 카테고리별 수입 합
	const incomeSummaries = derived(
		[transactionStore, dateFilter, prevDateFilter, incomeCategories],
		([$transactionStore, $dateFilter, $prevDateFilter, $incomeCategories]) => {
			const incomeDefaultValue = $incomeCategories.reduce(
				(acc, cur) => {
					return {
						...acc,
						[cur.category]: {
							icon: cur.icon,
							color: cur.color,
							thisAmount: 0,
							lastAmount: 0
						}
					};
				},
				//카테고리별 상태
				{} as Record<
					string,
					{
						icon?: string;
						color?: string;
						thisAmount: number;
						lastAmount: number;
					}
				>
			);

			const thisMonth = $transactionStore.filter(
				(v) =>
					v.type === 'income' && v.date < $dateFilter.endTime && v.date >= $dateFilter.startTime
			);
			const lastMonth = $transactionStore.filter(
				(v) =>
					v.type === 'income' &&
					v.date < $prevDateFilter.endTime &&
					v.date >= $prevDateFilter.startTime
			);

			const thisMonthInfo = thisMonth.reduce((acc, cur) => {
				return {
					...acc,
					[cur.category]: {
						...acc?.[cur.category],
						thisAmount: (acc?.[cur.category]?.thisAmount ?? 0) + cur.amount
					}
				};
			}, incomeDefaultValue);

			return lastMonth.reduce((acc, cur) => {
				return {
					...acc,
					[cur.category]: {
						...acc?.[cur.category],
						lastAmount: (acc?.[cur.category]?.lastAmount ?? 0) + cur.amount
					}
				};
			}, thisMonthInfo);
		}
	);

	onMount(() => {
		return () => {
			unsubDate();
		};
	});

	const options = derived(incomeSummaries, ($incomeSummaries) => {
		return Object.keys($incomeSummaries).map((category) => {
			return {
				series: [
					{
						name: '이번달 총 수입',
						color: '#31C48D',
						data: [$incomeSummaries[category].thisAmount.toString()]
					},
					{
						name: '지난달 수입 비교',
						data: [$incomeSummaries[category].lastAmount.toString()],
						color: '#adb5db'
					}
				],
				chart: {
					sparkline: {
						enabled: false
					},
					type: 'bar' as const,
					width: '100%',
					height: '150rem',
					toolbar: {
						show: false
					},
					background: 'transparent'
				},
				legend: {
					show: false
				},
				plotOptions: {
					bar: {
						horizontal: true,
						columnWidth: '100%',
						barHeight: '51%',
						borderRadiusApplication: 'end',
						borderRadius: 6,
						dataLabels: {
							position: 'top'
						}
					}
				},
				tooltip: {
					shared: true,
					intersect: false
				},
				dataLabels: {
					enabled: true,
					offsetX: 0
				},
				theme: {
					mode: 'dark',
					palette: 'palette4'
				},
				stroke: {
					show: true,
					width: 1,
					colors: ['#fff']
				},
				//category 종류
				xaxis: {
					categories: [`${$incomeSummaries[category].icon} ${category}`],
					axisTicks: {
						show: false
					},
					labels: {
						show: false
					},
					axisBorder: {
						show: true,
						color: '#e0e0e0'
					}
				},
				yaxis: {
					show: false
				},
				grid: {
					show: true,
					style: {
						cssClass: 'fill-[#666666] border-[#666666]'
					},
					xaxis: {
						lines: {
							show: false
						}
					},
					yaxis: {
						lines: {
							show: false
						}
					},
					strokeDashArray: 4,
					padding: {
						top: 0,
						left: 0,
						bottom: 0,
						right: 0
					}
				}
			};
		});
	});
</script>

<div class="px-10 py-4 grid grid-cols-[1fr_auto]">
	<div>
		{#each $options as option}
			{#if option.series[0].data?.[0] !== '0' && option.series[1].data?.[0] !== '0'}
				<h1>{option.xaxis.categories[0]}</h1>
				<Chart options={option} />
			{/if}
		{/each}
	</div>
	<Table class="flex-1 inline-block dark">
		<TableHead>
			<TableHeadCell>Category</TableHeadCell>
			<TableHeadCell>Total amount</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each $options as option}
				<TableBodyRow>
					<TableBodyCell>{option.xaxis.categories[0]}</TableBodyCell>
					<TableBodyCell>{Number(option.series[0].data?.[0]).toLocaleString()}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
