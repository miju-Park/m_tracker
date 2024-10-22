<script lang="ts">
	import { get } from 'svelte/store';
	import { dateStore } from '../../../store/date';
	import { onMount } from 'svelte';

	let year: number;
	let month: number;

	const unsubDate = dateStore.subscribe((cur) => {
		year = cur?.year;
		month = cur?.month;
	});

	onMount(() => {
		return () => {
			unsubDate();
		};
	});
</script>

<p>{year}</p>
<p>{month}</p>
