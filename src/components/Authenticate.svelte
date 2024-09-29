<script lang="ts">
	import { authHandler } from '../store/store';

	let email = '';
	let password = '';
	let confirmPass = '';
	let error = false;
	let authenticating = false;
	let isRegister = false;

	function handleRegister() {
		isRegister = !isRegister;
	}

	async function handleAuth() {
		if (!email || !password || (isRegister && !confirmPass)) {
			error = true;
			return;
		}
		authenticating = true;
		try {
			if (!isRegister) {
				await authHandler.login(email, password);
			} else {
				await authHandler.signup(email, password);
			}
		} catch (err) {
			console.log('There was an auth error', err);
			error = true;
			authenticating = false;
		}
	}
</script>

<div class="flex flex-col items-center justify-center flex-1">
	<h1 class="text-[3rem] font-bold">{isRegister ? 'Register' : 'Login'}</h1>
	{#if error}
		<p class="text-red-400">The information you entered is incorrect</p>
	{/if}
	<form class="flex flex-col gap-2 max-w-full w-[400px] mx-auto px-6">
		<label>
			<input bind:value={email} class="w-full" type="email" placeholder="Email" />
		</label>
		<label>
			<input bind:value={password} class="w-full" type="password" placeholder="Password" />
		</label>
		{#if isRegister}
			<label>
				<input
					bind:value={confirmPass}
					class="w-full"
					type="password"
					placeholder="Confirm Password"
				/>
			</label>
		{/if}
		<button type="submit" on:click={handleAuth} class="bg-sky-900 rounded-md py-2 hover:bg-sky-600">
			{authenticating ? '' : 'Submit'}</button
		>
	</form>
	<div class="w-[400px] mt-2 mx-auto px-6 overflow-hidden text-sm flex flex-col gap-1 max-w-full">
		<p class="option-bar">Or</p>
		{#if isRegister}
			<div class="flex items-center gap-2 justify-center">
				<p>Already have an account?</p>
				<p on:click={handleRegister} class="text-cyan-600 cursor-pointer" on:keydown={() => {}}>
					Login
				</p>
			</div>
		{:else}
			<div class="flex items-center gap-2 justify-center">
				<p>Don't have an account?</p>
				<p on:click={handleRegister} class="text-cyan-600 cursor-pointer" on:keydown={() => {}}>
					Register
				</p>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	form input {
		@apply border-none bg-transparent text-white px-2 py-4 rounded-md;
	}
	form input:focus {
		@apply border-none outline-none;
	}
	.option-bar {
		position: relative;
		text-align: center;
		width: fit-content;
		margin: 0 auto;
		padding: 0 8px;
	}
	.option-bar:before,
	.option-bar:after {
		position: absolute;
		content: '';
		top: 50%;
		transform: translateY(-50%);
		width: 100vw;
		height: 1.5px;
		background: white;
	}
	.option-bar:before {
		right: 100%;
	}
	.option-bar:after {
		left: 100%;
	}
</style>
