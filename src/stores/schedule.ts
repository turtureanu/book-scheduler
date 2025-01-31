import { arrayStore, variableStore } from 'svelte-capacitor-store';
import type { Book } from './books';

export type Schedule =
	| {
			book: Book;
			from?: string;
			until?: string;
			hasBeenRead?: boolean;
	  }[]
	| [];

export const scheduleStore = arrayStore<Schedule>({
	storeName: 'schedule',
	initialValue: [],
	persist: true
});

export const sortedScheduleType = variableStore({
	storeName: 'isSortedSchedule',
	initialValue: 'manual-sort',
	persist: true
});

export const isUpdateDismissed = variableStore({
	storeName: 'isUpdateDismissed',
	initialValue: false,
	persist: true
});

// todo(maybe): save and restore manually saved schedule
// export const manuallySortedSchedule = arrayStore<Schedule>({
// 	storeName: 'manually-sorted-schedule',
// 	initialValue: [],
// 	persist: true
// });
