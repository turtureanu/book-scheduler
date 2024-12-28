<script lang="ts">
	import { scheduleStore } from '../stores/schedule';
	import { bookStore, type Book } from '../stores/books';

	let isPopulated = $state(scheduleStore.get().length === 0 ? false : true);

	import { getToastStore, Toast, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	import { goto } from '$app/navigation';

	const t: ToastSettings = {
		hideDismiss: true,
		message: 'No books found!',
		action: {
			label: 'Add',
			response: () => goto('/books')
		}
	};

	const populateSchedule = () => {
		const books = bookStore.get() || [];
		const newSchedule = books.map((book: Book) => {
			return { book: book };
		});

		if (newSchedule.length === 0) {
			toastStore.clear();
			toastStore.trigger(t);
		} else {
			console.log(newSchedule, books);
			scheduleStore.update(() => newSchedule);
			isPopulated = isPopulated;
		}
	};
</script>

<Toast rounded="rounded-md" padding="px-3 py-2" />

<div class="flex h-full flex-col items-center justify-center">
	<button class="btn rounded-md bg-primary-800" onclick={populateSchedule}
		>Populate collection</button
	>
</div>
