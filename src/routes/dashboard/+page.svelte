<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '../../store/store';
	import { transactionHandlers, transactionStore } from '../../store/transaction';
	import type { User } from 'firebase/auth';
	import { Plus } from 'lucide-svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '@/components/ui/table';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';

	let user: User | null;
	authStore.subscribe(async (curr) => {
		user = curr.user;
		console.log('subscribe user');
		if (user) {
			const data = await transactionHandlers.getAll(user.uid);
			const transactions = data.docs.map((doc) => doc.data());

			transactionStore.set(transactions);
		}
	});

	function navigateToInput() {
		goto('/input');
	}
</script>

{#if !$authStore.loading}
	<div class="mainContainer">
		<div class="headerContainer">
			<h1>가계부 내역</h1>
			<!-- <div class="headerBtns">
				<button on:click={saveTodos}>
					<i class="fa-regular fa-floppy-disk" />
					<p>Save</p></button
				>
				<button on:click={authHandler.logout}>
					<i class="fa-solid fa-right-from-bracket" />
					<p>Logout</p></button
				>
			</div> -->
		</div>
		<main>
			<div class="transaction-table">
				<h2>Transactions</h2>
				{#if $transactionStore.length > 0}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each $transactionStore as transaction}
								<TableRow>
									<TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
									<TableCell>{transaction.description}</TableCell>
									<TableCell>{transaction.amount.toFixed(2)}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				{:else}
					<p>No transactions found.</p>
				{/if}
			</div>
			<Button size="icon" class="fixed right-8 bottom-8 rounded-full" on:click={navigateToInput}>
				<Plus />
			</Button>
		</main>
		<!-- <main>
			{#if todoList.length === 0}
				<p>You have nothing to do!</p>
			{/if}
			{#each todoList as todo, index}
				<TodoItem {todo} {index} {removeTodo} {editTodo} />
			{/each}
		</main>
		<div class={'enterTodo ' + (error ? 'errorBorder' : '')}>
			<input bind:value={currTodo} type="text" placeholder="Enter todo" />
			<button on:click={addTodo}>ADD</button>
		</div> -->
	</div>
{:else}
	<p>??</p>
{/if}
