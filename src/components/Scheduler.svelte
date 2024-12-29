<script lang="ts">
	import {
		Handle,
		SortableItem,
		SortableList,
		type SortEventDetail
	} from '@rodrigodagostino/svelte-sortable-list';

	import { scheduleStore, type Schedule } from '../stores/schedule';
	import { bookStore } from '../stores/books';

	import Icon from '@iconify/svelte';

	const handleSort = (event: CustomEvent<SortEventDetail>) => {
		const { prevItemIndex, nextItemIndex } = event.detail;
		// sort the store
		scheduleStore.update((schedule: Schedule) => {
			const [movedItem] = schedule.splice(prevItemIndex, 1);
			schedule.splice(nextItemIndex, 0, movedItem);
			return schedule;
		});
	};

	const handleUpdate = () => {
		scheduleStore.update((schedule: Schedule) => {
			bookStore.get().map((e) => {
				// add missing books
				if (!schedule.some((el) => el.book.id === e.id)) {
					schedule = [...schedule, { book: e }];
				}
			});

			// return only books that exist in bookStore
			return schedule.filter((el) => bookStore.get().some((book) => book.id === el.book.id));
		});

		$scheduleStore = $scheduleStore;
	};
</script>

<div class="m-auto flex max-w-2xl flex-col p-4">
	<SortableList
		hasBoundaries={true}
		direction="vertical"
		transitionDuration={200}
		hasLockedAxis={true}
		on:sort={handleSort}
	>
		{#each $scheduleStore as item, index (item.book.id)}
			<SortableItem id={item.book.id.toString()} {index}>
				<div class="flex items-center justify-between rounded-lg bg-surface-600 px-4 py-4">
					<!-- TODO: schedule date time using temporal and native APIs -->
					<div class="text-lg font-bold">
						{item.book.name}
					</div>
					<Handle>
						<Icon class="text-2xl" icon="material-symbols:drag-indicator" />
					</Handle>
				</div>
			</SortableItem>
		{/each}
	</SortableList>

	{#if $scheduleStore.length !== $bookStore.length}
		<div
			class="fixed bottom-24 m-auto mt-4 flex w-fit items-baseline justify-center gap-x-4 self-center rounded-lg bg-slate-800 px-4 py-2"
		>
			<p>Schedule is out of date</p>
			<button
				class="btn rounded-md bg-secondary-900 px-4 py-2 text-secondary-200"
				onclick={handleUpdate}>update</button
			>
		</div>
	{/if}
</div>
