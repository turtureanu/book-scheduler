<script module>
	// @ts-ignore
	import DragDropTouch from '$lib/DragDropTouch';
	import { onMount } from 'svelte';
</script>

<script lang="ts">
	import { scheduleStore } from '../stores/schedule';
	import { flip } from 'svelte/animate';
	import SortableItem from '$lib/SortableItem.svelte';
	import Icon from '@iconify/svelte';

	onMount(() => {
		let sortableItems = document.querySelectorAll('.sortable-item')!;
		sortableItems.forEach((item) => {
			// https://www.kryogenix.org/code/browser/custom-drag-image.html
			item.addEventListener(
				'dragstart',
				(e) => {
					e.preventDefault();
					let crt = new Image();
					crt.style.display = 'none';
					// @ts-expect-error
					e.dataTransfer.setDragImage(crt, 0, 0);
				},
				false
			);
		});
	});
</script>

<div class="sortable flex flex-col">
	{#each $scheduleStore as element, numberCounter (element.book.id)}
		<div animate:flip>
			<SortableItem
				propImageHidden={true}
				propItemNumber={numberCounter}
				bind:propData={$scheduleStore}
			>
				<div class="sortable-item">
					<Icon icon="mdi:menu" />
					{element.book.name}
				</div>
			</SortableItem>
		</div>
	{/each}
</div>

<p>{$scheduleStore}</p>
