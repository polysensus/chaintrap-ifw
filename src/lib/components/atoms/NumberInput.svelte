<script>
  /** @type string*/
  export let id;
  /** @type string*/
  export let label;
  /** @type number */
  export let value = 0;
  /** @type string*/
  export let placeholder = '0.0';
  /** @type string*/
  export let labelClass = 'label';
</script>

<div>
  <label for={id} class={labelClass}><span>{label}</span></label>
  <input type="number" {id} {placeholder} required {value} />
</div>
