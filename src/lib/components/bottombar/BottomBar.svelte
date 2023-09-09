<script>
  import { BottomNav, BottomNavItem, BottomNavHeader, BottomNavHeaderItem} from 'flowbite-svelte';
  import { WandMagicSparklesOutline, UserCircleOutline } from 'flowbite-svelte-icons';
  import CommandBox from '$lib/components/commandbox/CommandBox.svelte';
  export let createOn = false;
  export let profileOn = false;
</script>
<!--
<Skeleton class="py-4" />
<ImagePlaceholder class="pb-20" />
-->

<BottomNav position="absolute" navType="group" classInner="min-w-full grid-cols-3">

  <!-- clearing inner class makes the box appear to be the only elemement,
    
    the defaults are
    
    grid max-w-xs grid-cols-3 gap-1 p-1 mx-auto my-2 bg-gray-100 rounded-lg dark:bg-gray-600 

  -->
  <BottomNavHeader classInner="min-w-full" innerClass="" slot="header">
    <BottomNavItem btnClass="col-start-2 min-w-full">
      <CommandBox class="min-w-full border-2 rounded-lg"/>
    </BottomNavItem>
  </BottomNavHeader>
  <BottomNavItem btnName="Create" on:click={() => {createOn = !createOn}}>
    <WandMagicSparklesOutline class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
  </BottomNavItem>
  <BottomNavItem btnName="Empty">
  </BottomNavItem>
  <BottomNavItem btnName="Profile" on:click={() => {profileOn = !profileOn}}>
    <UserCircleOutline class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
  </BottomNavItem>
</BottomNav> 