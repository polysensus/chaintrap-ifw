<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  import {minimalSetup, EditorView} from "codemirror";
  import {EditorState} from "@codemirror/state";
  import {autocompletion, selectedCompletion, pickedCompletion} from "@codemirror/autocomplete";

  import {debounce} from "$lib/debounce.js";

  /// will do filtering based on context).
  /** @type {import("@codemirror/autocomplete").Completion[]}*/
  export let completions = [];
  let classes = "";
  export {classes as class };

  /** @type {string | null | undefined}*/
  export let value  = "";
  /** @type {string | undefined}*/
  export let lastPicked = undefined;

  export let debounceDelay = 300;

  /** @type {EditorView} */
  let view;

  /** @type {HTMLDivElement}*/
  let element;

  const isBrowser = typeof window !== "undefined";
  const updateFromProp = false;

  const dispatch = createEventDispatcher();

  function handleChange() {
    const content = view.state.doc.toString();
    if (content === value) return;
    value = content;
    dispatch("onChange", value);
  }

  function handleKeyup(event) {
    const code = event.keyCode ? event.keyCode : event.which;
    if (code === 13)
      dispatch("onComplete", value);
  }

  /**
   * 
   * @param {import("@codemirror/autocomplete").CompletionContext} context
   */
  function completionsForContext(context) {
    let before = context.matchBefore(/\w+/)
    // If completion wasn't explicitly started and there
    // is no word before the cursor, don't open completions.
    if (!context.explicit && !before) return null
    return {
      from: before ? before.from : context.pos,
      options: completions,
      validFor: /^\w*$/
    }
  }

  /**
   * Limit the command box to a single line entry field
   * - Any transaction which introduces a new line is filtered out.
   * - A 'newline' event with the new document contents is dispatched instead.
   * @param {import("@codemirror/state").Transaction} tr
   */
  function filterNewline(tr) {
    if (tr.newDoc.lines > 1) {
      dispatch('onNewline', tr.newDoc.toString());
      return [];
    }
    return [tr];
  }

  onMount(async ()=>{

    const onChange = debounce(handleChange, debounceDelay);
    view = new EditorView({
      parent: element,
      state: EditorState.create({
        extensions: [
          minimalSetup,
          autocompletion({override: [completionsForContext]}),
          EditorState.transactionFilter.of(filterNewline)
        ],
      }),
      dispatch(transaction) {
        view.update([transaction]);
        const picked = transaction.annotation(pickedCompletion);
        if (picked) {
          lastPicked = picked.label
          dispatch("onPick", picked)
        }
        // console.log(selectedCompletion(view.state));
        if (!updateFromProp && transaction.docChanged) {
          onChange()
        }
      }
    })
  });
  onDestroy(() => view?.destroy());

</script>

{#if isBrowser}
  <div class="codemirror-wrapper {classes}" bind:this={element} />
{:else}
  <div class="scm-waiting {classes}">
    <div class="scm-waiting__loading scm-loading">
        <div class="scm-loading__spinner" />
        <p class="scm-loading__text">Loading editor...</p>
    </div>

    <pre class="scm-pre cm-editor">{value}</pre>
  </div>
{/if}

<style>
  .codemirror-wrapper :global(.cm-focused) {
    /*width: 100px;*/
  }
  .codemirror-wrapper :global(.cm-editor) {
    /* border: 1px solid #ddd;
    width: 100px;*/
  }

  .scm-waiting {
      position: relative;
  }
  .scm-waiting__loading {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.5);
  }

  .scm-loading {
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .scm-loading__spinner {
      width: 1rem;
      height: 1rem;
      border-radius: 100%;
      border: solid 2px #000;
      border-top-color: transparent;
      margin-right: 0.75rem;
      animation: spin 1s linear infinite;
  }
  .scm-loading__text {
      font-family: sans-serif;
  }
  .scm-pre {
      font-size: 0.85rem;
      font-family: monospace;
      tab-size: 2;
      -moz-tab-size: 2;
      resize: none;
      pointer-events: none;
      user-select: none;
      overflow: auto;
  }

  @keyframes spin {
      0% {
          transform: rotate(0deg);
      }
      100% {
          transform: rotate(360deg);
      }
  }
</style>