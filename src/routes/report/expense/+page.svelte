<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { dateFilter, dateStore, prevDateFilter } from '../../../store/date';
	import { onMount } from 'svelte';
	import { expenseCategories } from '../../../store/configStore';
	import { transactionStore } from '../../../store/transaction';
	import { Chart, Table, TableHead, TableHeadCell } from 'flowbite-svelte';

	let year: number;
	let month: number;

	const unsubDate = dateStore.subscribe((cur) => {
		year = cur?.year;
		month = cur?.month;
	});

	const expenseSummaries = derived(
		[transactionStore, dateFilter, expenseCategories],
		([$transactionStore, $dateFilter, $expenseCategories]) => {
			const expenseDefaultValue = $expenseCategories.reduce(
				(acc, cur) => {
					const category = `[${cur.category}] ${cur.subCategory}`;
					return {
						...acc,
						[category]: {
							icon: cur.icon,
							color: cur.color,
							amount: 0,
							budget: cur?.budget ?? 0
						}
					};
				},
				{} as Record<string, { icon?: string; color?: string; amount: number; budget: number }>
			);

			return $transactionStore
				.filter(
					(v) =>
						v.type === 'expense' && v.date <= $dateFilter.endTime && v.date >= $dateFilter.startTime
				)
				.reduce((acc, cur) => {
					return {
						...acc,
						[cur.category]: {
							...acc?.[cur.category],
							amount: (acc?.[cur.category]?.amount ?? 0) + cur.amount
						}
					};
				}, expenseDefaultValue);
		}
	);

	onMount(() => {
		return () => {
			unsubDate();
		};
	});

	const options = derived(expenseSummaries, ($expenseSummaries) => {
		return {
			series: [
				{
					name: 'Actual',
					data: Object.keys($expenseSummaries).map((k) => $expenseSummaries[k].amount)
				},
				{
					name: 'Remaining',
					data: Object.keys($expenseSummaries).map((k) =>
						Math.max(0, $expenseSummaries[k].budget - $expenseSummaries[k].amount)
					)
				}
			],
			chart: {
				type: 'bar' as const,
				stacked: true,
				stackType: '100%',
				toolbar: {
					show: false
				},
				background: 'transparent'
			},
			plotOptions: {
				bar: {
					horizontal: true,
					barHeight: '60%',
					borderRadiusApplication: 'end'
				}
			},
			legend: {
				show: false
			},
			stroke: {
				width: 1,
				colors: ['#fff']
			},
			title: {
				text: '100% Stacked Bar'
			},
			theme: {
				mode: 'dark',
				palette: 'palette4'
			},
			xaxis: {
				categories: Object.keys($expenseSummaries),
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
			tooltip: {
				y: {
					formatter: function (val: number) {
						return val.toLocaleString();
					}
				}
			},
			yaxis: {
				show: true
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
						show: true
					}
				},
				strokeDashArray: 4
			}
		};
	});
</script>

<div class="px-10 py-4 h-[400px] flex flex-col">
	<Chart class="dark" options={$options} />

	<Table class="flex-1 inline-block dark">
		<TableHead>
			<TableHeadCell>Category</TableHeadCell>
			<TableHeadCell>Budget</TableHeadCell>
			<TableHeadCell>Total amount</TableHeadCell>
		</TableHead>
		<!-- <TableBody tableBodyClass="divide-y">
			{#each $options as option}
				<TableBodyRow>
					<TableBodyCell>{option.xaxis.categories[0]}</TableBodyCell>
					<TableBodyCell></TableBodyCell>
					<TableBodyCell>{Number(option.series[0].data?.[0]).toLocaleString()}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody> -->
	</Table>
</div>
