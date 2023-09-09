<script>
  export let svg="";
  export let scale=0.75;
</script>
<div class="container w-full h-1000" style="transform: scale({scale})">
  {@html svg}
</div>
<style>
  .container {
    /* Avoid setting explicit width and height here, to ensure the container sizes correctly */
    /* border: 2px solid red;*/
    /*height: 150%; XXX: hack, I believe the svg needs to be adjusted at source*/
    height: 800px;
  }
</style>