<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Drawer, getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { bookStore, type Book } from '../../stores/books';
	import { scheduleStore, type Schedule } from '../../stores/schedule';

	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'add-book',
		position: 'bottom',
		height: 'h-fit',
		bgDrawer: 'bg-transparent',
		shadow: ''
	};

	let bookName: Book['name'] = $state('');
	let bookAuthor: Book['author'] = $state('');
	let bookPages: Book['pages'] = $state(0);
	let nextID: Book['id'] = $state(1);

	const resetForm = () => {
		bookName = '';
		bookAuthor = '';
		bookPages = 0;
	};

	const addBook = () => {
		if (bookName && bookPages >= 0) {
			bookStore.update((books: Book[]) => {
				nextID += 1;
				books.push({
					id: nextID,
					name: bookName,
					author: bookAuthor,
					pages: bookPages
				});
				return books;
			});
			resetForm();
			drawerStore.close();
		}
	};

	const handleDelete = (id: number) => {
		bookStore.set(bookStore.get().filter((book) => book.id !== id));
		// remove the book from the schedule as well
		scheduleStore.update((schedule: Schedule) =>
			schedule.filter((_, i) => !$scheduleStore.findIndex((b) => b.book.id === i))
		);
	};

	const handleEdit = (id: number) => {
		let { name, author, pages } = bookStore.get().filter((book) => book.id == id)[0];
		bookName = name;
		bookAuthor = author || '';
		bookPages = pages || 0;
		drawerStore.open(drawerSettings);
	};
</script>

<Drawer>
	<div class="mb-10 flex justify-center">
		<div class="max-w-md rounded-md bg-surface-800">
			<div class="mb-4 flex flex-col items-center justify-between gap-4 pt-6">
				<input
					required
					bind:value={bookName}
					placeholder="Book name"
					class="input w-[90%] rounded-md p-2 text-xl outline-none"
				/>
				<input
					bind:value={bookAuthor}
					placeholder="Author"
					class="input w-[90%] rounded-md p-2 text-xl outline-none"
				/>
				<input
					bind:value={bookPages}
					placeholder="Pages"
					type="number"
					class="input w-[90%] rounded-md p-2 text-xl outline-none"
				/>
			</div>
			<div class="mb-4 flex justify-end gap-2 px-6">
				<button class="btn w-20 px-2 py-1.5 text-lg" onclick={() => drawerStore.close()}>
					Cancel
				</button>
				<button class="btn w-20 rounded-md bg-success-700 px-2 py-1.5 text-lg" onclick={addBook}>
					Add
				</button>
			</div>
		</div>
	</div>
</Drawer>

<div class="m-auto flex max-w-2xl flex-col justify-between p-4">
	<div class="flex flex-col gap-4">
		{#each $bookStore as book (book.id)}
			<div class="flex items-center justify-between rounded-lg bg-surface-600 px-4 py-2">
				<div class="flex w-full items-center justify-between">
					<div class="flex gap-4">
						<Icon icon="mdi-book" class="self-center text-2xl" />
						<div class="max-w-36 text-lg font-bold leading-6">
							{book.name.length! > 28 ? book.name.slice(0, 28).trim() + '…' : book.name}
						</div>
					</div>
					<div class="text-center">
						{book.author?.length! > 16 ? book.author?.slice(0, 16) + '…' : book.author}
					</div>
					<div class="text-center">{book.pages === 0 ? 'N/A' : book.pages} pages</div>
				</div>
				<div class="flex items-center">
					<button class="btn p-4 hover:text-amber-400" onclick={() => handleEdit(book.id)}>
						<Icon icon="mdi-edit" />
					</button>
					<button class="btn p-4 hover:text-red-400" onclick={() => handleDelete(book.id)}>
						<Icon icon="mdi-trash" />
					</button>
				</div>
			</div>
		{/each}
	</div>
	<button
		class="variant-filled-secondary btn fixed bottom-24 mt-4 w-fit self-center rounded-lg p-2.5"
		onclick={() => drawerStore.open(drawerSettings)}
	>
		<span class="text-2xl">
			<Icon icon="stash:plus-solid" />
		</span>
		<span>Add book</span>
	</button>
</div>

<style>
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
