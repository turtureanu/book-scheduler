<script lang="ts">
	import { scheduleStore } from '../stores/schedule';
	import { bookStore, type Book } from '../stores/books';

	import { getToastStore, Toast, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	import { goto } from '$app/navigation';
	import Scheduler from '../components/Scheduler.svelte';

	const noBookToast: ToastSettings = {
		hideDismiss: true,
		message: 'No books found!',
		action: {
			label: 'Add',
			response: () => goto('/books')
		}
	};

	const populateSchedule = () => {
		const books = $bookStore || [];
		$scheduleStore = books.map((b: Book) => {
			return { book: b };
		});

		if ($bookStore.length === 0) {
			toastStore.clear();
			toastStore.trigger(noBookToast);
			return;
		}
	};
</script>

<Toast rounded="rounded-md" padding="px-3 py-2" />

{#if $scheduleStore.length !== 0}
	<Scheduler />
{:else}
	<div class="flex h-full flex-col items-center justify-center">
		<button class="btn rounded-md bg-primary-800" onclick={populateSchedule}
			>Populate schedule</button
		>
	</div>
{/if}
