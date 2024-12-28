import { arrayStore } from 'svelte-capacitor-store';
import type { Book } from './books';
import { Temporal } from 'temporal-polyfill';

type Schedule =
	| {
			book: Book;
			from?: Temporal.PlainDateTime;
			until?: Temporal.PlainDateTime;
	  }[]
	| [];

export const scheduleStore = arrayStore<Schedule>({
	storeName: 'schedule',
	initialValue: [],
	persist: true
});
