<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Drawer, getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';

	import { bookStore, type Book } from '../../stores/books';

	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { isUpdateDismissed } from '../../stores/schedule';

	const drawerStore = getDrawerStore();

	//  bottom drawer
	const drawerSettings: DrawerSettings = {
		id: 'book-popup-menu',
		position: 'bottom',
		height: 'h-fit',
		bgDrawer: 'bg-transparent',
		shadow: ''
	};

	// variables used in bottom drawer form
	let bookName: Book['name'] = $state('');
	let bookAuthor: Book['author'] = $state('');
	let bookPages: Book['pages'] = $state(0);

	let checkedBooks = $state($bookStore.map((_) => false));

	const resetForm = () => {
		bookName = '';
		bookAuthor = '';
		bookPages = 0;
	};

	const handleDelete = (id: number) => {
		bookStore.set(bookStore.get().filter((book) => book.id !== id));
		checkedBooks = $bookStore.map((_) => false);
		$isUpdateDismissed = false;
	};

	let editing = $state({ id: -1, isBeingEdited: false });

	const handleEdit = (id: number) => {
		editing.id = id;
		editing.isBeingEdited = true;

		let { name, author, pages } = $bookStore.filter((book) => book.id == id)[0];
		bookName = name;
		bookAuthor = author || '';
		bookPages = pages || 0;
		drawerStore.open(drawerSettings);
	};

	const handleBook = () => {
		if (bookName && bookPages >= 0) {
			bookStore.update((books: Book[]) => {
				if (editing.isBeingEdited) {
					const editedBook = books.filter((e) => e.id === editing.id)[0];

					editedBook.name = bookName;
					editedBook.author = bookAuthor;
					editedBook.pages = bookPages;
					editing.isBeingEdited = false;
				} else {
					books.push({
						id: books.length > 0 ? books.slice(-1)[0].id + 1 : 0,
						name: bookName,
						author: bookAuthor,
						pages: bookPages
					});
				}

				return books;
			});

			$isUpdateDismissed = false;
			resetForm();
			drawerStore.close();
		}
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
				<button class="btn w-20 rounded-md bg-success-700 px-2 py-1.5 text-lg" onclick={handleBook}>
					Save
				</button>
			</div>
		</div>
	</div>
</Drawer>

<div class="m-auto flex max-w-2xl flex-col justify-between p-4">
	<div class="mb-24 flex flex-col gap-3">
		{#each $bookStore as book (book.id)}
			<div>
				<input
					type="checkbox"
					class="hidden"
					bind:checked={checkedBooks[$bookStore.indexOf(book)]}
					name={`check-${book.id}`}
					id={`check-${book.id}`}
				/>
				<label for={`check-${book.id}`} class="cursor-pointer">
					<div class="flex items-center justify-between rounded-lg bg-surface-600 px-2 py-5">
						<Icon icon="mdi-book" class="mx-2 w-6 min-w-6 text-2xl" />
						<div
							class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold leading-6"
						>
							{book.name.trim()}
						</div>
						<Icon
							icon="octicon:chevron-up-12"
							rotate={1}
							class={`mr-5 w-6 text-2xl transition-all duration-150 ${checkedBooks[$bookStore.indexOf(book)] ? 'rotate-90' : ''}`}
						/>
					</div>
				</label>
				{#if checkedBooks[$bookStore.indexOf(book)]}
					<div
						transition:fade={{ duration: 150, easing: linear }}
						class="mt-3 rounded-md bg-surface-500 p-3 text-lg"
					>
						<div class="mt-2 flex justify-between gap-x-2 px-3 py-2">
							<span class="font-bold">Author:</span>
							<span class="overflow-hidden text-ellipsis text-nowrap">
								{#if book.author}
									{book.author.trim()}
								{:else}
									N/A
								{/if}
							</span>
						</div>
						<div class="mb-2 flex justify-between px-3">
							<span class="font-bold">Pages:</span>

							{#if book.pages}
								{book.pages}
							{:else}
								N/A
							{/if}
						</div>
						<div class="mt-4 flex justify-end gap-x-4 px-1 py-2">
							<button class="btn rounded-md" onclick={() => handleDelete(book.id)}> Delete </button>
							<button class="btn rounded-md bg-secondary-700" onclick={() => handleEdit(book.id)}>
								Edit
							</button>
						</div>
					</div>
				{/if}
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
		appearance: textfield;
		-moz-appearance: textfield;
	}
</style>
