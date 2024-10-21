<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import {
		Content,
		Popover,
		PopoverContent,
		PopoverTrigger,
		Root,
		Trigger
	} from '@/components/ui/popover';
	import Calculator from '../../components/Calculator.svelte';
	import { auth } from '@/firebase/firebase';
	import { authStore } from '../../store/store';
	import { transactionHandlers } from '../../store/transaction';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '@/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { Datepicker } from '@/components/ui/datepicker';
	import { CalendarDate } from '@internationalized/date';
	import dayjs from 'dayjs';
	import { Button } from '@/components/ui/button';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandList
	} from '@/components/ui/command';
	import { CommandInput } from 'cmdk-sv';
	import { Textarea } from '@/components/ui/textarea';
	import { Timestamp } from 'firebase/firestore';
	import { expenseCategories, incomeCategories } from '../../store/configStore';
	import { get } from 'svelte/store';

	let description = '';
	let today = dayjs();
	let date = new CalendarDate(today.year(), today.month() + 1, today.date());
	let amount = '';
	let type: Selected<string> = {
		value: 'income',
		label: '수입'
	};
	let category = '';
	let memo = '';
	let inputCategory = {
		label: '',
		color: ''
	};
	let popover = {
		categoryOpen: false,
		calculatorOpen: false
	};

	async function handleSubmit() {
		const userId = $authStore.user?.uid;
		if (userId) {
			const pattern = /^\S+\s+(.+)$/;
			const match = inputCategory.label.match(pattern);
			const category = match ? match[1] : '';
			const transaction = {
				description,
				date: Timestamp.fromDate(new Date(date.toString())),
				amount: Number(amount),
				type: type.value,
				category,
				memo,
				userId
			};

			await transactionHandlers.add(transaction);
			goto('/dashboard');
		}

		// try {
		// 	const response = await fetch('/api/transactions', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify(transaction)
		// 	});
		// 	const data = await response.json();
		// 	console.log(data);
		// } catch (error) {
		// 	console.error('Failed to save transaction');
		// }
	}

	function handleAmountSubmit(event: CustomEvent<{ amount: number }>) {
		amount = event.detail.amount.toLocaleString();
		popoverIsOpen = false;
	}
</script>

<div in:fly={{ y: 200, duration: 500 }}>
	<h1>가계부 입력</h1>

	<form on:submit|preventDefault={handleSubmit}>
		<div class="flex w-full justify-start max-w-sm flex-col gap-1.5">
			<Label class="text-[#1abc9c] font-bold px-4">날짜</Label>
			<Datepicker bind:value={date} />
		</div>
		<div class="flex flex-col w-full">
			<Label class="text-[#1abc9c] font-bold">금액</Label>
			<Popover
				open={popover.calculatorOpen}
				onOpenChange={(val) => {
					popover.calculatorOpen = val;
				}}
			>
				<PopoverTrigger>
					<Input bind:value={amount} class="border-0 rounded-none border-b-2 border-white w-full" />
				</PopoverTrigger>
				<PopoverContent align="start" class="w-[350px] p-0 bg-transparent border-none">
					<Calculator on:submit={handleAmountSubmit} />
				</PopoverContent>
			</Popover>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label class="text-[#1abc9c] font-bold px-4">타입</Label>
			<Select bind:selected={type}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="income">수입</SelectItem>
					<SelectItem value="expense">지출</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div class="flex flex-col justify-start w-full">
			<Label class="text-[#1abc9c] font-bold px-4">카테고리</Label>
			<Popover open={popover.categoryOpen} onOpenChange={(val) => (popover.categoryOpen = val)}>
				<PopoverTrigger class="w-full">
					<Button class={`w-full rounded-md bg-[${inputCategory.color}]`}>
						{#if inputCategory.label}
							{inputCategory.label}
						{:else}
							카테고리 선택
						{/if}
					</Button>
				</PopoverTrigger>
				<PopoverContent class="p-0 w-[--radix-popover-trigger-width]" align="start">
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
													color: category?.color ?? ''
												};
												popover.categoryOpen = false;
											}}
										>
											{category.icon}
											{category.category}
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

		<div class="flex flex-col w-full gap-1.5">
			<Label class="text-[#1abc9c] font-bold px-4">메모</Label>
			<Textarea id="memo" bind:value={memo}></Textarea>
		</div>

		<Button type="submit" class="w-full bg-[#1abc9c]">저장</Button>
	</form>
</div>

<style>
	form {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
		border-radius: 10px;
	}

	label {
		font-weight: bold;
		color: white;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border-radius: 5px;
		border: none;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
		border-radius: 5px;
	}

	button:hover {
		background-color: #45a049;
	}
</style>
