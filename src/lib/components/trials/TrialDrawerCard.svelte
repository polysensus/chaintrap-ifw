<script>
  import {ethers} from "ethers";
  import { Card, Button, Toggle, Label, Input, Checkbox } from "flowbite-svelte";
  let hCard = false;
  let nickname;
  export let enableRegistration = false;
  export let registered = false;
  export let trial = {
    gid: ethers.BigNumber.from(1),
    tokenUri: "",
    gatewayImageUrl: "/static/nft-defaults/game-ico-2.png",
    codex: {},
    metadata: {
      title: "A game of chaintrap",
      description: `
Chaintrap is a turn based, competitive, dungeon explorer game. This token
records the journey, and the fate, of a group of trialists.`,
      image: "ipfs://xxx/yyy/foo.png"
    }
  }
</script>
<div>
  <Card img={trial.gatewayImageUrl} href="." horizontal reverse={hCard}>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{trial.gid.toHexString()}</h5>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{trial.metadata.title}</h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
      {trial.metadata.description}
    </p>
    {#if (!registered && enableRegistration)}
		    <h5 class="text-xl font-medium text-gray-900 dark:text-white">Register with the trial</h5>
		    <Label class="space-y-2">
		    	<span>Nickname</span>
		    	<Input type="text" name="name" bind:value={nickname} placeholder="anonymous alice" required />
		    </Label>
		    <Button type="button" on:click={console.log(`nickname: ${nickname}`)} class="w-full">Login to your account</Button>
    {/if}

  </Card>
  <Toggle bind:checked={hCard} class="mt-4 italic dark:text-gray-500">Reverse</Toggle>
</div>

