<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { Content, Popover, Root, Trigger } from '@/components/ui/popover';
	import Calculator from '../../components/Calculator.svelte';
	import { auth } from '@/firebase/firebase';
	import { authStore } from '../../store/store';
	import { transactionHandlers } from '../../store/transaction';
	let popoverIsOpen = false;
	let description = '';
	let date = new Date().toISOString().slice(0, 10);
	let amount = '';
	let type = 'expense';
	let category = '';
	let memo = '';

	const categories = ['식비', '교통', '주거', '의료', '교육', '여가', '기타'];

	async function handleSubmit() {
		const userId = $authStore.user?.uid;
		if (userId) {
			const transaction = {
				description,
				date: new Date(date),
				amount: Number(amount),
				type,
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
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="description">내역</Label>
			<Input id="description" placeholder="내역" bind:value={description} style="width: 100%;" />
		</div>

		<div class="flex w-full justify-start max-w-sm flex-col gap-1.5">
			<Input type="date" bind:value={date} />
		</div>

		<Root portal={null} bind:open={popoverIsOpen}>
			<Trigger>
				<div>
					<Label for="amount">금액</Label>
					<Input id="amount" style="width: 100%;" bind:value={amount} />
				</div>
			</Trigger>
			<Content class="w-80">
				<Calculator on:submit={handleAmountSubmit} />
			</Content>
		</Root>

		<div>
			<label for="type">타입:</label>
			<select id="type" bind:value={type}>
				<option value="expense">지출</option>
				<option value="income">수입</option>
			</select>
		</div>

		<div>
			<label for="category">카테고리:</label>
			<select id="category" bind:value={category} required>
				<option value="">선택하세요</option>
				{#each categories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="memo">메모:</label>
			<textarea id="memo" bind:value={memo}></textarea>
		</div>

		<button type="submit">저장</button>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 400px;
		margin: 0 auto;
	}

	label {
		font-weight: bold;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background-color: #45a049;
	}
</style>
