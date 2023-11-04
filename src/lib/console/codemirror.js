import {snippetCompletion} from "@codemirror/autocomplete";
import { CommandSet } from "./commandset.js";

export class CodeMirrorCommandSet extends CommandSet {
  snippetCompletions() {
    return this.priority.map((value)=>{
      const c = this.completions[value].completion;
      return snippetCompletion( c.phrase, {label: c.prefix, type: "keyword"});
    });
  }
}