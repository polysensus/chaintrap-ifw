<script>
  // framework imports
  import { setContext } from 'svelte';

  // framework components

  // application components

  // application imports

  // -- dungeon creation local state stores

  // --- constants
  
  // contexts
  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

</script>
<div class="container mx-auto flex justify-center gap-4">
  <!-- <h2 class="h2">Welcome to Chaintrap.</h2> -->
  <a href="/trial/create" class="btn variant-ringed-surface">Narrate</a>
  <a href="/trial/lobby" class="btn variant-ringed-surface">Raid</a>
</div>
<style>
  /* You can still add styles here using element selectors */
  body, html {
    height: 100%;
    margin: 0;
  }
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full height of the viewport */
  }
</style>