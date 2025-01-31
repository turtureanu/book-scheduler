<script lang="ts">
	import {
		Handle,
		SortableItem,
		SortableList,
		type SortEventDetail
	} from '@rodrigodagostino/svelte-sortable-list';

	import Icon from '@iconify/svelte';

	import {
		scheduleStore,
		sortedScheduleType,
		isUpdateDismissed,
		type Schedule
	} from '../stores/schedule';
	import { bookStore, type Book } from '../stores/books';
	import DateInput from './DateInput.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	const handleSort = (event: CustomEvent<SortEventDetail>) => {
		const { prevItemIndex, nextItemIndex } = event.detail;
		// sort the store
		scheduleStore.update((schedule: Schedule) => {
			const [movedItem] = schedule.splice(prevItemIndex, 1);
			schedule.splice(nextItemIndex, 0, movedItem);
			return schedule;
		});
	};

	// check if any book properties have been changed
	// return true if they have been changed
	const checkUpdateBooks = () => {
		if ($isUpdateDismissed) {
			return false;
		}
		let scheduledBooks: Book[] = $scheduleStore.map((el) => {
			if (el.book.author) {
				return {
					id: el.book.id,
					name: el.book.name,
					author: el.book.author,
					pages: el.book.pages
				};
			} else {
				return {
					id: el.book.id,
					name: el.book.name,
					pages: el.book.pages
				};
			}
		});

		if (
			scheduledBooks.length === $bookStore.length &&
			scheduledBooks.every((e, i) => JSON.stringify(e) === JSON.stringify($bookStore[i]))
		) {
			return false;
		}
		return true;
	};

	const handleUpdate = () => {
		$isUpdateDismissed = true;
		scheduleStore.update((schedule: Schedule) => {
			const existingBookIds = new Set(schedule.map((el) => el.book.id));
			const updatedSchedule = $bookStore.map((book) => {
				if (!existingBookIds.has(book.id)) {
					return { book };
				}
				const existingEntry = schedule.find((el) => el.book.id === book.id);
				return { book, from: existingEntry?.from, until: existingEntry?.until };
			});
			return updatedSchedule;
		});

		handleListSort();
	};

	// check if the start date is before the end date based on the id of a book in the schedule
	const checkDates = (id: number): boolean => {
		return $scheduleStore.every((e) => {
			if (e.book.id === id) {
				return !(e.from && e.until && new Date(e.from) > new Date(e.until));
			}
			return true;
		});
	};

	let handleListSort = () => {
		scheduleStore.update((schedule) => {
			return schedule.sort((a, b) => {
				if ($sortedScheduleType === 'start-date') {
					return new Date(a.from || 0).getTime() - new Date(b.from || 0).getTime();
				} else if ($sortedScheduleType === 'end-date') {
					return new Date(a.until || 0).getTime() - new Date(b.until || 0).getTime();
				} else {
					return 0;
				}
			});
		});
	};

	// get the book the user should currently be reading
	// based on the start date
	let currentBook = () => {
		let schedule = undefined;
		const today = new Date(new Date().toISOString().split('T')[0]);
		$scheduleStore.some((e) => {
			if (e.from !== undefined && today >= new Date(e.from)) {
				schedule = e;
				return true;
			}
		});

		return schedule;
	};

	// return a negative or positive integer value (days)
	// the range is inclusive
	const getDateRange = (start: string | Date | undefined, end: string | Date | undefined) => {
		if (start && end) {
			const dayDiff: number =
				(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);

			return dayDiff > 0 ? Math.ceil(dayDiff) + 1 : Math.ceil(dayDiff) - 1;
		}
	};
</script>

{#if checkUpdateBooks()}
	<div class="flex w-full items-baseline justify-center bg-slate-800 p-1">
		<p>Schedule is out of date</p>
		<button class="btn px-4 font-bold" onclick={() => ($isUpdateDismissed = true)}>dismiss</button>
		<button
			class="btn rounded-md bg-secondary-900 px-4 py-2 font-bold text-secondary-200"
			onclick={handleUpdate}>update</button
		>
	</div>
{/if}

{#key $scheduleStore}
	<!-- eslint complains about it being undefined, but as you can see, I'm checking that right here -->
	{#if currentBook() && currentBook().from && currentBook().until}
		<div class="m-auto mb-2 mt-8 max-w-2xl px-4">
			<div
				class={`card ${currentBook().book.name.lenght > 10 || currentBook().book.author.length > 20 ? 'flex flex-col' : 'flex'} items-center justify-between rounded-lg px-6 py-6 outline outline-secondary-400`}
			>
				<div class="w-full">
					<p class="text-xl leading-10">
						Currently reading <br />
						<span class="break-words text-3xl font-bold">
							{currentBook().book.name}
						</span>
						<br />
						{#if currentBook().book.author !== 'N/A' && currentBook().book.author !== undefined && currentBook().book.author.length !== 0}
							<span class="break-words">
								by {currentBook().book.author}
							</span>
						{/if}
					</p>
				</div>
				{#if new Date() >= new Date(currentBook().from)}
					<div class="mt-6 flex w-fit min-w-48 flex-col justify-around">
						<div>
							<p class="text-center text-4xl font-bold">
								{#if getDateRange(new Date(), currentBook().until) > 0}
									{getDateRange(new Date(), currentBook().until)}
								{:else}
									{-getDateRange(new Date(), currentBook().until)}
								{/if}
							</p>
							<p class="text-center text-2xl">
								day{getDateRange(new Date(), currentBook().until) === 1 ? '' : 's'}
								{getDateRange(new Date(), currentBook().until) > 0 ? 'left' : 'behind'}
							</p>
						</div>
						<ProgressBar
							class="mt-2 h-3"
							value={getDateRange(currentBook().from, currentBook().until) -
								getDateRange(new Date(), currentBook().until)}
							max={getDateRange(currentBook().from, currentBook().until)}
						/>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/key}

<div class="-z-10 m-auto max-w-2xl p-4 pb-28">
	<SortableList
		direction="vertical"
		transitionDuration={200}
		hasLockedAxis={true}
		isLocked={$sortedScheduleType !== 'manual-sort' ? true : false}
		on:sort={handleSort}
	>
		<div class="mb-1 rounded-lg bg-surface-600 px-4 py-2">
			<p class="text-center text-lg">
				Sort items according to
				<select
					name="schedule-sort-type"
					id="schedule-sort-type"
					class="select ml-1 w-fit rounded-xl bg-slate-900 p-2 px-1 text-center focus-within:border-none focus:outline-none"
					bind:value={$sortedScheduleType}
					onchange={handleListSort}
				>
					<option value="manual-sort">manual sort</option>
					<option value="start-date">start date</option>
					<option value="end-date">end date</option>
				</select>
			</p>
		</div>
		<hr class="mx-auto my-3 h-1 w-full rounded-full border-none bg-surface-500 outline-none" />
		{#each $scheduleStore as item, index (item.book.id)}
			<SortableItem id={item.book.id.toString()} {index}>
				<div
					class="flex items-center justify-between rounded-lg px-4 py-3 {item.hasBeenRead
						? 'bg-green-900'
						: 'bg-surface-600'}"
				>
					<div class="flex max-w-40 items-center font-bold">
						<button
							class="button mr-1.5 text-3xl"
							onclick={() => (item.hasBeenRead = !item.hasBeenRead)}
						>
							{#if item.hasBeenRead}
								<Icon icon="ri:checkbox-fill" />
							{:else}
								<Icon icon="ri:checkbox-line" />
							{/if}
						</button>
						<Icon icon="mdi-book" class="mr-2 w-6 min-w-6 text-2xl" />
						<span class="overflow-hidden text-ellipsis whitespace-nowrap">
							{item.book.name}
						</span>
					</div>
					<div class="flex">
						<div class="mr-1 flex">
							{#key item.from}
								{handleListSort()}
								{#if !item.from}
									<DateInput
										text="start date"
										id={`from-${item.book.id}`}
										bind:value={$scheduleStore[index].from}
									/>
								{:else}
									<div
										class={`${!checkDates(item.book.id) ? 'outline-3 rounded-md outline outline-red-500' : ''}`}
									>
										<DateInput
											text={item.from.toString()}
											id={`from-${item.book.id}`}
											isPicked={true}
											bind:value={$scheduleStore[index].from}
										/>
									</div>
								{/if}
							{/key}
						</div>
						<div class="flex">
							{#key item.until}
								{handleListSort()}
								{#if !item.until}
									<DateInput
										text="end date"
										id={`until-${item.book.id}`}
										bind:value={$scheduleStore[index].until}
									/>
								{:else}
									<div
										class={`${!checkDates(item.book.id) ? 'outline-3 rounded-md outline outline-red-500' : ''}`}
									>
										<DateInput
											text={item.until.toString()}
											id={`until-${item.book.id}`}
											isPicked={true}
											bind:value={$scheduleStore[index].until}
										/>
									</div>
								{/if}
							{/key}
						</div>
						<div class="self-center">
							{#if $sortedScheduleType === 'manual-sort'}
								<Handle>
									<div class="special-handle py-2 pl-4">
										<Icon class="text-2xl" icon="material-symbols:drag-indicator" />
									</div>
								</Handle>
							{/if}
						</div>
					</div>
				</div>
			</SortableItem>
		{/each}
	</SortableList>
</div>

<style>
	.special-handle {
		touch-action: none;
	}
</style>
