<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Navbar from '../components/Navbar.svelte';
	let { children }: { children: any } = $props();

	// Initialize SkeletonUI Stores
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	import Bowser from 'bowser-ultralight';

	initializeStores();
</script>

<div class="flex h-full flex-col justify-between">
	{#if document && Bowser.getParser(window.navigator.userAgent).isMobile() === false}
		<div class="bg-red-800 p-2 text-center">
			<b>Warning!</b> This app is not meant to run on desktop! Open it on mobile instead.
		</div>
	{/if}
	{#key $page.url}
		<div id="currentPage" class="h-full w-full">
			{@render children()}
		</div>
	{/key}
	<Navbar />
</div>

<style>
	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	#currentPage {
		animation: fadeIn 250ms ease-in;
	}
</style>
