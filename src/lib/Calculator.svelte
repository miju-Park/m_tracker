<script lang="ts">
	import { writable } from 'svelte/store';
	let expression = writable(''); // 계산식
	let result = writable(''); // 결과값

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
		<button on:click={clearAll}>AC</button>
		<div />
		<div />
		<button on:click={removeLastExpression}>🔙</button>
		{#each ['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '*', '0', '(', ')', '/'] as value}
			<button class="" on:click={() => updateExpression(value)}>{value}</button>
		{/each}
	</div>
</div>

<style>
	.calculator {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 300px;
		margin: 50px auto;
	}
	.display {
		width: 100%;
		background-color: #333;
		color: white;
		font-size: 2em;
		text-align: right;
		padding: 10px;
		margin-bottom: 10px;
	}
	.buttons {
		display: grid;
		grid-template-columns: repeat(4, 75px);
		gap: 5px;
	}
	button {
		padding: 10px;
		font-size: 18px;
		border: none;
		cursor: pointer;
		border-radius: 5px;
		font-family: Arial, sans-serif;
		text-align: center;
	}
</style>
