<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { getTargetDate } from '../../store/utils';

	const dispatch = createEventDispatcher();

	export let month = getTargetDate()?.month ?? 0;
	export let year = getTargetDate()?.year ?? 0;
	let date = new Date();
	export const disabledMove = false;

	function updateMonth(change: number) {
		month += change;
		if (month < 1) {
			month = 12;
			year--;
		} else if (month > 12) {
			month = 1;
			year++;
		}
		dispatch('monthChange', { month, year });
	}
</script>

<div class="month-picker">
	{#if !disabledMove}
		<button class="nav" on:click={() => updateMonth(-1)}><ChevronLeft /></button>
	{/if}
	<div>
		<div class="year">{year}</div>
		<div class="month">{month}월</div>
	</div>
	{#if !disabledMove}
		<button class="nav" on:click={() => updateMonth(1)}><ChevronRight /></button>
	{/if}
</div>

<style>
	.month-picker {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #1abc9c;
		padding: 20px;
		border-radius: 10px;
		color: white;
		font-family: Arial, sans-serif;
	}
	.month-picker > div {
		text-align: center;
	}
	@media (max-width: 600px) {
		.month-picker {
			padding: 10px; /* 모바일 환경에서의 조정된 패딩 */
		}
	}

	.nav {
		cursor: pointer;
		font-size: 18px;
		margin: 0 20px;
	}
	.month {
		font-size: 24px;
		margin: 0;
	}
	.year {
		font-size: 14px;
		margin: 0;
	}

	@media (min-width: 600px) {
		.nav {
			font-size: 22px;
		}
		.month {
			font-size: 36px;
		}
		.year {
			font-size: 20px;
		}
	}

	@media (min-width: 900px) {
		.nav {
			font-size: 24px;
		}
		.month {
			font-size: 48px;
		}
		.year {
			font-size: 24px;
		}
	}
</style>
