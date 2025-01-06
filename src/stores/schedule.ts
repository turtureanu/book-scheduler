import { arrayStore, objectStore } from 'svelte-capacitor-store';
import type { Book } from './books';

export type Schedule =
	| {
			book: Book;
			from?: string;
			until?: string;
	  }[]
	| [];

export const scheduleStore = arrayStore<Schedule>({
	storeName: 'schedule',
	initialValue: [],
	persist: true
});

export const sortedScheduleType = objectStore({
	storeName: 'isSortedSchedule',
	initialValue: 'manual-sort',
	persist: true
});

// todo(maybe): save and restore manually saved schedule
// export const manuallySortedSchedule = arrayStore<Schedule>({
// 	storeName: 'manually-sorted-schedule',
// 	initialValue: [],
// 	persist: true
// });
