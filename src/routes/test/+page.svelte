<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { derived } from 'svelte/store';
	import { authStore } from '../../store/store';
	import { transactionHandlers, transactionStore } from '../../store/transaction';
	import { expenseCategories } from '../../store/configStore';
	import { Timestamp } from 'firebase/firestore';

	const fetchTransaction = async (userId: string, start_date: Date, end_date: Date) => {
		if (userId && start_date && end_date) {
			console.log(userId);
			const transactions = await transactionHandlers.getAllByRange(userId, start_date, end_date);
			transactionStore.addUnique(transactions);
		}
	};

	const unsubscribe = authStore.subscribe(async (curr) => {
		try {
			const user = curr.user;
			if (user) {
				await fetchTransaction(
					user?.uid ?? '',
					new Date('2024-06-25T00:00:00+09:00'),
					new Date('2024-12-24T23:59:59+09:00')
				);
			}
		} catch (error) {
			console.log('Error authStore subscribe');
			console.error(error);
		}
	});

	const allCategories = derived(
		[transactionStore, expenseCategories],
		([$transactionStore, $expenseCategories]) => {
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
				})
				.reduce((acc, cur) => {
					if (acc.has(cur.category)) {
						return acc;
					}
					acc.set(cur.category, {
						icon: cur?.icon ?? '',
						color: cur?.color ?? '',
						amount: 0,
						budget: cur.budget
					});

					return acc;
				}, new Map<string, { icon?: string; color?: string; amount: number; budget: number }>());

			const target = $transactionStore
				.filter((v) => v.type === 'expense')
				.reduce((result, { date, category, amount, ...rest }) => {
					if (result.has(category)) {
						const existing = result.get(category)!;
						result.set(category, {
							...existing,
							amount: existing.amount + Number(amount) // 기존 amount에 추가
						});
					}
					return result;
				}, expenseDefaultValue);

			const result: Array<{
				category: string;
				amount: number;
				icon?: string;
				color?: string;
				budget: number;
			}> = [];
			target.forEach((value, key) => {
				result.push({ category: key, ...value });
			});
			console.log(result);

			return result.map((a) => ({
				...a,
				amount: a?.amount ?? 0,
				budget: a?.budget ?? 0,
				newBudget: a?.amount ? Math.round(a.amount / 6) : 0
			}));
		}
	);
</script>

<Table.Root>
	<Table.Caption>6개월 평균으로 예산 설정</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Category</Table.Head>
			<Table.Head>총 소비</Table.Head>
			<Table.Head>기존 예산</Table.Head>
			<Table.Head>평균 소비금액</Table.Head>
			<Table.Head>Diff(기존예산-평균소비금액)</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each $allCategories as summary}
			<Table.Row>
				<Table.Cell>{summary.icon} {summary.category}</Table.Cell>
				<Table.Cell>{summary.amount.toLocaleString()}</Table.Cell>
				<Table.Cell>{summary.budget.toLocaleString()}</Table.Cell>
				<Table.Cell>{summary.newBudget.toLocaleString()}</Table.Cell>
				<Table.Cell>{(summary.budget - summary.newBudget).toLocaleString()}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
