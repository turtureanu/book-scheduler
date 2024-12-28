import { arrayStore } from 'svelte-capacitor-store';

export type Book = {
	id: number;
	name: string;
	author?: string;
	pages?: number;
};

export const bookStore = arrayStore<Book[]>({
	storeName: 'book',
	initialValue: [],
	persist: true
});
