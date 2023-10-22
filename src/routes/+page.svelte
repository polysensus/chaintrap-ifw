<script>
  import { onMount, onDestroy, setContext, getContext } from 'svelte';
  import { writable, derived } from 'svelte/store';

  import { Navbar, NavBrand, NavUl, NavLi } from 'flowbite-svelte';

  import ProvidersDropdown from '$lib/components/presence/ProvidersDropdown.svelte';
  import PreviewMapCard from '$lib/components/creator/PreviewMapCard.svelte';
  import BottomBar from '$lib/components/bottombar/BottomBar.svelte';
  import FurnitureSummaryList from '$lib/components/furniture/FurnitureSummaryList.svelte';
  import GenerateGameIconCard from '$lib/components/creator/GenerateGameIconCard.svelte';
  import FurnishLocationsContextStore from '$lib/components/FurnishLocationsContextStore.svelte';
  import GenerateMap from '$lib/components/creator/GenerateMap.svelte';

  import { ChainPresence } from '$lib/chains/presence.js';
  import { ArenaEvent, arenaConnect } from '@polysensus/chaintrap-arenastate';
  import {
    Guardian, Trialist,
    EventParser, Dispatcher,
    GameMetadataReader,
    prepareTrialMetadata,
    prepareTrialInitArgs,
    chaintrapGameDefaults
  } from '@polysensus/chaintrap-arenastate';

  import { all } from '$lib/chains/supportedproviders.js';

  import { newMap, newTrialCodex } from '$lib/maptool.js';
  import { TrialContent } from '$lib/clientdata/trialcontent.js';
  import {ImageGeneratorOpenAI} from '$lib/generative/gameicon.js';

  import { newMapStore } from '$lib/clientdata/storemap.js';
  import { newFurnitureStore } from '$lib/clientdata/storefurnishings.js';
  import { newTrialPosterStore } from '$lib/clientdata/storetrialposter.js';

  import { newOwnerTrials } from '$lib/clientdata/storetrials/owned.js';
  import { newRecentlyCreated } from '$lib/clientdata/storetrials/recent.js';

  /**
   * @type {{request:{href?:string,origin?:string}}}
   */
  export let data; // see +page.js:load
  setContext('data', data);

  const maptoolUrl = '/api/maptool';
  const metadataURL = '/api/nftstorage/metadata';

  /** @type {ImageGeneratorOpenAI} */
  let imageGenerator;
  const presence = new ChainPresence({ networks: all });
  setContext('presence', presence);

  let trialdb;
  let providers = [];
  let cfg;
  let mapParams = {};
  /** @type {string|undefined}*/
  let providerButtonText;
  let showFurnishingControl = true;

  /** @type {{connect:Function,subscribe:Function,add:Function}|undefined}*/
  let map = newMapStore();
  setContext('map', map);
  /** @type {{connect:Function,subscribe:Function,add:Function,put:Function}|undefined}*/
  let furnishings = newFurnitureStore();
  setContext('furnishings', furnishings);

  let trialPoster = newTrialPosterStore();
  setContext('trialPoster', trialPoster);

  let arena = writable(undefined);
  setContext('arena', arena);

  let eventParser = derived(arena, ($arena)=> {
    if (!$arena) return undefined;
    return new EventParser($arena, ArenaEvent.fromParsedEvent);
  });
  setContext('eventParser', eventParser);

  const eventDispatcher = derived(eventParser, ($eventParser, set) => {
    if (!$eventParser)  {
      set(undefined);
      return undefined;
    }
    const dispatcher = new Dispatcher($eventParser);
    set(dispatcher);
    return () => dispatcher.stopListening()
  });
  setContext('eventDispatcher', eventDispatcher);

  let guardian = derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Guardian($eventDispatcher.parser, {dispatcher:$eventDispatcher})
  });
  setContext('guardian', guardian);

  let trialist = derived(eventDispatcher, ($eventDispatcher) => {
    if (!$eventDispatcher) return undefined;
    return new Trialist($eventDispatcher.parser, {dispatcher:$eventDispatcher})
  });
  setContext('trialist', trialist);


  let ownedGames = newOwnerTrials(eventParser);
  setContext('ownedGames', ownedGames);

  const recentGames = newRecentlyCreated(eventParser);
  setContext('recentGames', recentGames);

  // let trialist = writable(undefined);
  // setContext('trialist', trialist);

  function updateCurrentProvider(current) {
    if (!current?.signer) return undefined;
    const address = data.arenaAddress[current.cfg.name];
    if (!address) {
      console.log(`no address for provider config: ${current.cfg.name} ${JSON.stringify(data.arenaAddress)}`);
      return undefined;
    }
    return arenaConnect(address, current.signer)
  }

  async function onProviderSelect(cfg) {
    await presence.selectProvider(cfg.name);
    $arena = updateCurrentProvider(presence?.providerSwitch?.getCurrent());
    console.log('arena:', $arena);
  }

  async function onProviderDeselect(cfg) {
    presence.logout();
  }

  async function onClickGenerate() {
    console.log(`${JSON.stringify(mapParams)}`);
    const { password } = mapParams;
    const params = { ...mapParams };
    delete params.password;
    console.log('calling newMap');
    const result = await newMap(params, {
      maptoolUrl,
      svg: true
    });
    console.log(`ok: ${result.ok}`);
    if(!(map && result && result.ok && result.map))
      return;

    await map.add({...result.map, meta: {svg: result.svg, maptoolUrl}});
  }

  /**
   * @param {{detail:{prompt?:string}}} event 
   */
  async function generateTrialPoster(event) {
    if (!event?.detail?.prompt)
      return;

    // console.log(imageGenerator?.apiPath);
    const result = await imageGenerator.generate(event.detail.prompt)
    // console.log(`${JSON.stringify(resp.meta)}`);
    trialPoster.add(result);
  }

  function onComplete(value) {
    console.log('completion event');
    console.log(JSON.stringify(value.detail))
    console.log('arena:', $arena);
    console.log('eventParser:', $eventParser);
    console.log('guardian:', $guardian);
    createTrial()
      .then((result)=>{
        console.log(`created game ${result.gid}`);
        console.log(`${JSON.stringify(result)}`);
      });
  }

  /**
   * 
   * @param {{codexPassword?:string,networkEIP1559?:boolean}} options
   */
  async function createTrial(options={}) {

    if (!($guardian && $trialPoster && $map && $furnishings)) {
      console.log(`guardian, poster, map and furnishings are all required to create a trial`);
      return;
    }

    const name = options.name ?? `trial in ${$map.name ?? "an un-named dungeon"}`;
    const description = options.description ?? 'a game of chaintrap';
    const maxParticipants = options.maxParticipants;

    console.log('----');
    console.log($furnishings);

    const {codex, data, passwordGenerated} = await newTrialCodex({}, $map, $furnishings, $map.meta.svg, options);
    $guardian.setupTrial(codex, {password:passwordGenerated ?? (options.codexPassword ?? null)});

    const metadata = prepareTrialMetadata($map, $guardian.trie, {name, description});

    const body = {
      image: {
        bytes: $trialPoster.base64,
        contentType: $trialPoster.meta.contentType,
        filename: `game-icon.${$trialPoster.meta.contentType.split('/').pop() ?? 'png'}`
      },
      codex: {
        serialized: codex.serialize(),
        filename: 'blobcodex.json'
      },
      metadata
    };

    // Note: it is assumed that the front end proxies via routes/api/openai/ to
    // get the auth and actual target url.
    const result = await fetch(metadataURL, {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
    });
    const {tokenURI} = await result.json();
    console.log(`tokenURI: ${tokenURI}`);

    const args = prepareTrialInitArgs(metadata.properties, {
      ...chaintrapGameDefaults, registrationLimit: maxParticipants, tokenURI,
      networkEIP1559: options?.networkEIP1559
    });

    console.log(`guardian: ${$guardian}, arena ${$guardian.arena}, args: ${JSON.stringify(args)}`);

    return {tokenURI, ...(await $guardian.createGame(...args))}
  }

  // $:{
  // 	if (presence?.providerSwitch?.available)
  // 		providers = Object.values(presence.providerSwitch.available)
  // }

  let trialPosterImg;

  $:{
    if ($trialPoster)
      trialPosterImg = $trialPoster?.meta?.imgHeader + $trialPoster.base64;
  }

  onMount(async () => {

    imageGenerator = new ImageGeneratorOpenAI(fetch, `${data?.request?.origin}/api/openai/images/generation`);

    providers = Object.values(await presence.refreshProviders());
    trialdb = new TrialContent({name: 'trial_content'});
    await trialdb.create();
    await map.connect(trialdb);
    await furnishings.connect(trialdb);
    await trialPoster.connect(trialdb);

    // force open the create drawer if there are no local maps
    if (!$map)
      showFurnishingControl = false;
  });
  onDestroy(async () => {
    if (trialdb)
      trialdb.close();
    trialdb = undefined;
  })
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <img src="/apple-icon-120x120.png" class="mr-3 h-6 sm:h-9" alt="Polysensus Logo" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
      ><a href="https://www.polysensus.com" target="_blank">Polysensus</a></span
    >
  </NavBrand>
  <!--<NavHamburger on:click={toggle} /> -->
  <NavUl {hidden} >
    <!--<NavLi href="/contact"><a href="https://www.polysensus.com" target="_blank" >Contact</a></NavLi> -->
    <NavLi id="providers-toggle" class="cursor-pointer">
      {providerButtonText}<!--<ChevronDownOutline class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline" /> -->
    </NavLi>
    <!--
      onSelect={onProviderSelect},
      onDeselect={onProviderDeselect},
    -->
    <ProvidersDropdown width={"w-80"}
      {providers}
      onSelect={onProviderSelect}
      onDeselect={onProviderDeselect}
      bind:buttonText={providerButtonText}
      bind:cfg />
  </NavUl>
</Navbar>

<div>
  <!--
  <Skeleton class="py-4" />
  <ImagePlaceholder class="pb-20" />
  -->
  <p>Found {$ownedGames.length} games for current wallet</p>
  <p>Found {$recentGames.length} games recently created</p>

  <GenerateGameIconCard img={trialPosterImg} on:onGenerateGameIcon={generateTrialPoster}/>
  {#if $map?.meta?.svg}
    <PreviewMapCard mapImg={$map.meta.svg} mapScale={0.5}/>
  {/if}
  <!--<CreateMapDrawer {onClickGenerate} bind:mapParams bind:hidden={createDrawerClosed} /> -->
  {#if showFurnishingControl}
  <FurnitureSummaryList map={$map} furnishings={$furnishings}/>
  <br/>
  <FurnishLocationsContextStore />
  {:else}
  <GenerateMap {onClickGenerate} bind:params={mapParams} bind:hidden={showFurnishingControl} />
  {/if}
  <BottomBar on:onNewline={onComplete} bind:createOn={showFurnishingControl}/>
</div>
