<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { dateFilter, dateStore, prevDateFilter } from '../../../store/date';
	import { onMount } from 'svelte';
	import { configStore, incomeCategories } from '../../../store/configStore';
	import { transactionStore } from '../../../store/transaction';
	import {
		Chart,
		Card,
		A,
		Button,
		Dropdown,
		DropdownItem,
		Table,
		TableHead
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
			console.log($dateFilter);
			const incomeDefaultValue = $incomeCategories.reduce(
				(acc, cur) => {
					return {
						...acc,
						[cur.category]: {
							icon: cur.icon,
							color: cur.color,
							amount: 0
						}
					};
				},
				{} as Record<string, { icon?: string; color?: string; amount: number }>
			);

			const thisMonth = $transactionStore.filter(
				(v) =>
					v.type === 'income' && v.date <= $dateFilter.endTime && v.date >= $dateFilter.startTime
			);
			const lastMonth = $transactionStore.filter(
				(v) =>
					v.type === 'income' &&
					v.date <= $prevDateFilter.endTime &&
					v.date >= $prevDateFilter.startTime
			);

			return thisMonth.reduce((acc, cur) => {
				console.log(acc);
				return {
					...acc,
					[cur.category]: {
						...acc?.[cur.category],
						amount: (acc?.[cur.category]?.amount ?? 0) + cur.amount
					}
				};
			}, incomeDefaultValue);
		}
	);

	onMount(() => {
		return () => {
			unsubDate();
		};
	});

	const options = derived(incomeSummaries, ($incomeSummaries) => {
		return {
			series: [
				{
					name: '이번달 총 수입',
					color: '#31C48D',
					data: Object.values($incomeSummaries).map((v) => v.amount.toString())
				},
				{
					name: '지난달 수입 비교',
					data: ['0', '0', '0', '0'],
					color: '#F05252'
				}
			],
			chart: {
				sparkline: {
					enabled: false
				},
				type: 'bar',
				width: '100%',
				height: '100%',
				toolbar: {
					show: false
				}
			},
			fill: {
				opacity: 1
			},
			plotOptions: {
				bar: {
					horizontal: true,
					columnWidth: '100%',
					borderRadiusApplication: 'end',
					borderRadius: 6,
					dataLabels: {
						position: 'top'
					}
				}
			},
			dataLabels: {
				enabled: true,

				offsetX: 30
			},
			xaxis: {
				labels: {
					show: false
				},
				categories: Object.keys($incomeSummaries).map((k) => `${$incomeSummaries[k].icon} ${k}`),
				axisTicks: {
					show: false
				},
				axisBorder: {
					show: false
				}
			},
			yaxis: {
				labels: {
					show: true,
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'font-bold fill-white opacity-70'
					}
				}
			},
			grid: {
				show: true,
				style: {
					cssClass: 'fill-gray-400'
				},
				strokeDashArray: 4,
				padding: {
					left: 2,
					right: 2,
					top: -20
				}
			}
		};
	});
</script>

<div class="px-10 py-4 h-[400px] flex flex-col">
	<Chart options={$options} />
	<Table>
		<TableHead></TableHead>
	</Table>
</div>
