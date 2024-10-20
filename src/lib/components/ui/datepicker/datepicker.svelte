<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { HTMLAttributes } from 'react';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	type $$Props = HTMLAttributes<HTMLButtonElement> & {
		value?: DateValue | undefined;
	};

	export let value: DateValue | undefined = undefined;
	let className: $$Props['className'] = undefined;
	export { className as class };
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				'w-[280px] justify-start hover:bg-transparent text-left font-normal bg-transparent border-none hover:text-white',
				className,
				!value && 'text-muted-foreground'
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar bind:value initialFocus />
	</Popover.Content>
</Popover.Root>
