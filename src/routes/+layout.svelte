<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Navbar from '../components/Navbar.svelte';
	let { children }: { children: any } = $props();

	// Initialize SkeletonUI Stores
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<div class="flex h-full flex-col justify-between">
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
		animation: fadeIn 150ms ease-in-out;
	}
</style>
