<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { summariedTransactions } from '../../store/transaction';
	import { Progressbar } from 'flowbite-svelte';

	const savingPortion = derived(summariedTransactions, ($summariedTransactions) => {
		if ($summariedTransactions.income === 0) {
			return 0;
		}
		return (
			(($summariedTransactions.income - $summariedTransactions.expense) /
				$summariedTransactions.income) *
			100
		);
	});
	const progressColor = derived(savingPortion, ($savingPortion) => {
		if ($savingPortion === 0) {
			return undefined;
		}
		if ($savingPortion < 50) {
			return 'red' as const;
		}
		return 'blue' as const;
	});
</script>

<div class="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
	<span class="font-bold opacity-70">총 수입</span>
	{$summariedTransactions.income.toLocaleString()} 원

	<span class="font-bold opacity-70">지출</span>
	{$summariedTransactions.expense.toLocaleString()} 원
	<span class="font-bold opacity-70">저축률</span>
	<Progressbar
		progress={Math.min(100, $savingPortion).toString()}
		size="h-4"
		labelInside
		color={$progressColor}
	/>
</div>
