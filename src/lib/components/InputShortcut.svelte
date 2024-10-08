<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Datepicker } from './ui/datepicker';
	import { Label } from './ui/label';
	import Input from './ui/input/input.svelte';

	const dispatch = createEventDispatcher();

	let type = '수입';
	let date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
	let description = '';
	let amount = '';

	function handleSubmit() {
		dispatch('submit', { type, date, description, amount });
	}
</script>

<div class="input-container bg-gradient-to-r from-[#000428] to-[#000046]">
	<select bind:value={type} class="input-field">
		<option value="수입">수입</option>
		<option value="지출">지출</option>
	</select>

	<div class="flex flex-col">
		<Label class="text-[#1abc9c] font-bold">날짜</Label>
		<Datepicker />
	</div>
	<div>
		<Label class="text-[#1abc9c] font-bold">내용</Label>
		<Input type="text" bind:value={description} class="input-field" />
	</div>

	<div>
		<Label class="text-[#1abc9c] font-bold">내용</Label>
		<Input type="number" bind:value={amount} class="input-field" />
	</div>

	<button on:click={handleSubmit} class="button">확인</button>
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
		padding: 10px;
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

	.button {
		background-color: white;
		color: #1abc9c;
		border: none;
		padding: 5px 10px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
	}

	.button:hover {
		background-color: #16a085;
		color: white;
	}
</style>
