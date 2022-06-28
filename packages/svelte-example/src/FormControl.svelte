<script lang="ts">
	import type { FormControlWithValidators } from '@doughtnerd/qwizard-core';

  export let config: FormControlWithValidators
  export let component
</script>

<svelte:component this={component} bind:value={config.control.value} />