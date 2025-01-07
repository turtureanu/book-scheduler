<script lang="ts">
	let {
		text,
		id,
		isPicked = false,
		value = $bindable()
	}: { text: string; id: string; isPicked?: boolean; value: string | undefined } = $props();
</script>

<div>
	<input class="h-0 w-0 scale-0" type="date" name={`date-${id}`} id={`date-${id}`} bind:value />
	<button
		class={`${isPicked ? 'variant-soft-secondary' : 'variant-soft-tertiary'} btn w-24 rounded-md`}
		><label for={`date-${id}`}>{text}</label></button
	>
</div>
