<script lang="ts">
	import { page } from '$app/stores';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	let isHidden = $state(false);

	import { Keyboard } from '@capacitor/keyboard';

	Keyboard.addListener('keyboardWillShow', (info) => {
		isHidden = true;
	});

	Keyboard.addListener('keyboardWillHide', () => {
		isHidden = false;
	});
</script>

{#if !isHidden}
	<TabGroup
		justify="justify-center"
		active="bg-surface-700"
		rounded="rounded-lg"
		border=""
		class="fixed bottom-0 z-10 w-full bg-surface-500 px-2 py-1"
	>
		<TabAnchor class="mr-1.5 w-24" href="/" selected={$page.url.pathname === '/'}>
			<svelte:fragment slot="lead">
				<span class="flex justify-center text-2xl"
					><Icon icon="material-symbols:view-timeline-outline-rounded" /></span
				>
			</svelte:fragment>
			<span>Schedule</span>
		</TabAnchor>

		<TabAnchor class="w-24" href="/books" selected={$page.url.pathname === '/books'}>
			<svelte:fragment slot="lead">
				<span class="flex justify-center text-2xl"
					><Icon icon="material-symbols:menu-book-outline-sharp" /></span
				>
			</svelte:fragment>
			<span>Books</span>
		</TabAnchor>
	</TabGroup>
{/if}
