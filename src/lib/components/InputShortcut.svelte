<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Datepicker } from './ui/datepicker';
	import { Label } from './ui/label';
	import Input from './ui/input/input.svelte';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandInput,
		CommandList
	} from './ui/command';
	import { Popover, PopoverTrigger } from './ui/popover';
	import PopoverContent from './ui/popover/popover-content.svelte';
	import { Button } from './ui/button';
	import Calculator from '../../components/Calculator.svelte';
	import dayjs from 'dayjs';
	import { CalendarDate } from '@internationalized/date';
	import { Select, SelectContent, SelectItem, SelectValue } from './ui/select';
	import SelectTrigger from './ui/select/select-trigger.svelte';
	import type { Selected } from 'bits-ui';
	import { get } from 'svelte/store';
	import { expenseCategories, incomeCategories, withdrawCategories } from '../../store/configStore';
	import ResponsiveModal from '../../components/ResponsiveModal.svelte';

	const dispatch = createEventDispatcher();

	let type: Selected<string> = {
		value: 'income',
		label: '수입'
	};
	let today = dayjs();
	let date = new CalendarDate(today.year(), today.month() + 1, today.date());
	let inputCategory = {
		label: '',
		color: ''
	};
	let description = '';
	let amount: null | number = null;
	let popover = {
		categoryOpen: false,
		calculatorOpen: false
	};

	function handleAmountSubmit(event: CustomEvent<{ amount: number }>) {
		amount = event.detail.amount;
		popover.calculatorOpen = false;
	}

	function handleSubmit() {
		const pattern = /^\S+\s+(.+)$/;
		const match = inputCategory.label.match(pattern);
		const category = match ? match[1] : '';

		dispatch('submit', { type: type.value, category, date: date.toString(), description, amount });

		// Reset the form
		// type = { value: 'income', label: '수입' };
		inputCategory = {
			label: '',
			color: ''
		};
		amount = null;
		description = '';
		// date = new CalendarDate(today.year(), today.month() + 1, today.date());
	}
</script>

<div class="input-container bg-gradient-to-r from-[#000428] to-[#000046] px-12 items-center">
	<Select bind:selected={type}>
		<SelectTrigger class="w-28">
			<SelectValue />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="income">수입</SelectItem>
			<SelectItem value="expense">지출</SelectItem>
			<SelectItem value="withdraw">이체</SelectItem>
		</SelectContent>
	</Select>

	<div class="flex flex-col">
		<Label class="text-[#1abc9c] font-bold px-4">날짜</Label>
		<Datepicker bind:value={date} class="w-[150px]" />
	</div>
	<div class="flex flex-col">
		<Label class="text-[#1abc9c] font-bold px-4">카테고리</Label>
		<Popover open={popover.categoryOpen} onOpenChange={(val) => (popover.categoryOpen = val)}>
			<PopoverTrigger>
				<Button class={`rounded-md bg-[${inputCategory.color}] text-start`}>
					{#if inputCategory.label}
						{inputCategory.label}
					{:else}
						카테고리 선택
					{/if}
				</Button>
			</PopoverTrigger>
			<PopoverContent class="p-0 w-auto">
				<Command>
					<CommandInput placeholder="Select category" />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{#if type.value === 'income'}
								{#each get(incomeCategories) as category}
									<CommandItem
										value={category.category}
										class="grid grid-cols-[1fr,auto] gap-1 items-center"
										onSelect={(val) => {
											inputCategory = {
												label: `${category.icon} ${val}`,
												color: category.color
											};
											popover.categoryOpen = false;
										}}
									>
										{category.icon}
										{category.category}
									</CommandItem>
								{/each}
							{:else if type.value === 'withdraw'}
								{#each get(withdrawCategories) as category}
									<CommandItem
										value={`[${category.category}] ${category.subCategory}`}
										class="grid grid-cols-[1fr,auto] gap-1 items-center"
										onSelect={(val) => {
											inputCategory = {
												label: `${val}`,
												color: category?.color ?? ''
											};
											popover.categoryOpen = false;
										}}
									>
										[{category.category}]
										{category.subCategory}
									</CommandItem>
								{/each}
							{:else}
								{#each get(expenseCategories) as category}
									<CommandItem
										value={`[${category.category}] ${category.subCategory}`}
										class="grid grid-cols-[1fr,auto] gap-1 items-center"
										onSelect={(val) => {
											inputCategory = {
												label: `${category.icon} ${val}`,
												color: category?.color ?? ''
											};
											popover.categoryOpen = false;
										}}
									>
										{category.icon}
										[{category.category}]
										{category.subCategory}
									</CommandItem>
								{/each}
							{/if}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	</div>

	<div class="flex flex-col">
		<Label class="text-[#1abc9c] font-bold px-4">내용</Label>
		<Input bind:value={description} class="border-none" />
	</div>

	<div class="flex flex-col">
		<Label class="text-[#1abc9c] font-bold">금액</Label>
		<ResponsiveModal
			triggerTargetValue={amount ? `${amount.toLocaleString()}` : ''}
			title="금액 입력"
			triggerClassName="min-w-[200px] bg-transparent border-none justify-start p-0"
			open={popover.calculatorOpen}
		>
			<Calculator on:submit={handleAmountSubmit} initialValue={amount} />
		</ResponsiveModal>
	</div>

	<Button variant="ghost" class="hover:bg-[#1abc9c]" on:click={handleSubmit}>입력</Button>
</div>

<style>
	.input-container {
		border: 2px solid #16a085;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* White shadow */
		position: relative;
		margin-top: -20px;
		display: inline-flex;
		margin-left: auto;
		margin-right: auto;
		justify-content: center;
		align-items: center;
		padding: 10px 40px;
		border-radius: 10px;
		color: white;
		font-family: Arial, sans-serif;
	}

	input,
	select {
		background-color: transparent;
	}

	.input-field {
		margin: 0 10px;
		padding: 5px;
		border-radius: 5px;
		border: none;
		font-size: 16px;
	}
</style>
