<script lang="ts">
	import { Form } from '@doughtnerd/qwizard-core'
import FormControl from './FormControl.svelte';
import Test from './Test.svelte';

	const config = Form.Control('Hello')

	$: display = config.control.value

	export let name: string;
</script>

<main>
	<FormControl component={Test} {config}/>
	{display}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
