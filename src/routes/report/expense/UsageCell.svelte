<script lang="ts">
	import { AlertTriangleIcon } from 'lucide-svelte';

	export let budget: number = 0;
	export let amount: number = 0;

	$: usagePercent = budget === 0 ? 0 : (amount / budget) * 100;
	$: isExceed = usagePercent >= 100;

	$: statusColor = (()=>{
		if (usagePercent >= 100) {
			return 'text-red-600';
		} else if (usagePercent > 80) {
			return 'text-yellow-600';
		}
		return 'text-green-600';
	})()

	
</script>

  <span class={`flex items-center justify-end gap-1 ${statusColor}`}>
		{isExceed ? 100 : usagePercent.toFixed(1)}%
		{#if isExceed}
			<AlertTriangleIcon />
		{/if}
	</span>
  

