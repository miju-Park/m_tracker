<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let date = new Date();
	let month = date.getMonth() + 1; // JavaScript months are zero-based
	let year = date.getFullYear();

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
	<button class="nav" on:click={() => updateMonth(-1)}><ChevronLeft /></button>
	<div>
		<div class="month">{month}월</div>
		<div class="year">{year}</div>
	</div>
	<button class="nav" on:click={() => updateMonth(1)}><ChevronRight /></button>
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

	.nav {
		cursor: pointer;
		font-size: 24px;
		margin: 0 20px;
	}
	.month {
		font-size: 48px;
		margin: 0;
	}
	.year {
		font-size: 24px;
		margin: 0;
	}
</style>
