<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	let expression = writable(''); // 계산식
	let result = writable(''); // 결과값

	const dispatch = createEventDispatcher<{ submit: { amount: number } }>();

	const updateExpression = (value: string) => {
		expression.update((prev) => prev + value);
		calculateResult();
	};

	const removeLastExpression = () => {
		expression.update((prev) => (prev?.length >= 1 ? prev.slice(0, -1) : ''));
		calculateResult();
	};

	const clearAll = () => {
		expression.set('');
		result.set('');
	};

	const calculateResult = () => {
		expression.subscribe((exp) => {
			try {
				result.set(eval(exp) || '');
			} catch (e) {
				result.set('');
			}
		});
	};
	const handleKeyDown = (e: KeyboardEvent) => {
		const allowedKeys = '0123456789+-*/()';
		const keyCode = e.key;

		if (allowedKeys.includes(keyCode)) {
			updateExpression(keyCode);
		} else if (keyCode === 'Backspace') {
			removeLastExpression();
		} else if (keyCode === 'Enter') {
			calculateResult();
			dispatch('submit', { amount: Number($result) }); // Submit on Enter
		}
	};
</script>

<svelte:document on:keydown={handleKeyDown} />

<div class="calculator">
	<div class="display">
		<div>
			<!-- 수식 -->
			{#each $expression as char}
				{char}
			{/each}
		</div>
		<div>
			<!-- 결과 -->
			= {$result ? Number($result).toLocaleString() : $result}
		</div>
	</div>
	<div class="buttons">
		<button on:click|stopPropagation={clearAll}>AC</button>
		<div />
		<div />
		<button on:click|stopPropagation={removeLastExpression}>🔙</button>
		{#each ['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '*', '0', '(', ')', '/'] as value}
			<button class="" on:click|stopPropagation={() => updateExpression(value)}>{value}</button>
		{/each}
	</div>
	<button
		on:click|stopPropagation={() => {
			dispatch('submit', { amount: Number($result) });
		}}>OK</button
	>
</div>

<style>
	.calculator {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 280px;
		margin: 20px auto;
		background-color: #1a1a2e; /* Dark background */
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.display {
		width: 100%;
		background-color: #162447; /* Slightly lighter dark */
		color: #e0e0e0; /* Light text color */
		font-size: 1.5em;
		text-align: right;
		padding: 10px;
	}

	.buttons {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 5px;
	}

	button {
		padding: 12px;
		font-size: 16px;
		border: none;
		cursor: pointer;
		border-radius: 5px;
		background-color: #1f4068; /* Teal accent */
		color: #e0e0e0; /* Light text color */
	}

	button:hover {
		background-color: #162447; /* Darker on hover */
	}

	button:active {
		background-color: #1b1b2f; /* Even darker when pressed */
	}
</style>
