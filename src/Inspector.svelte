<script>
  import { onMount } from 'svelte';
  let enabled = true;
  let open;
  let x;
  let y;

  $: ({ file, line, col } = parse(open));

  onMount(() => {
    document.body.addEventListener('mouseover', mouseover);
    document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('click', click);

    return () => {
      document.body.removeEventListener('mouseover', mouseover);
      document.body.removeEventListener('mousemove', mousemove);
      document.body.removeEventListener('click', click);
    };
  });

  function mousemove(event) {
    if (!enabled) return;
    x = event.x;
    y = event.y;
  }
  function mouseover(event) {
    if (!enabled) return;
    open = event.target.dataset.svelteInspect;
  }
  function click() {
    if (!enabled || !open) return;
    fetch('/__svelte-inspector?open=' + open);
  }
  function parse(open) {
    if (open) {
      const parts = open.split(':');
      const col = +parts.pop();
      const line = +parts.pop();
      const file = parts.join(':');
      return { file, line, col };
    }
    return {};
  }
</script>

<div class="toggle" class:enabled on:click={() => (enabled = !enabled)}>
  <img
    src="https://github.com/tanhauhau/vite-plugin-svelte-inspector/blob/master/src/logo.png?raw=true"
    alt="logo"
  />
</div>

{#if enabled && file}
  <ul class="overlay" style:left="{x + 10}px" style:top="{y + 10}px">
    <li>file: {'<'}{file}{'>'}</li>
    <li>line: {line}</li>
    <li>column: {col}</li>
  </ul>
{/if}

<style>
  .overlay {
    position: fixed;
    border: 2px dashed #666;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    text-align: left;
  }
  ul {
    list-style-type: none;
  }
  .toggle {
    border-radius: 50%;
    position: fixed;
    top: 10px;
    right: 10px;
    height: 50px;
    width: 50px;
    background: white;
    border: 2px solid red;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  img {
    width: 80%;
    height: 80%;
    margin-top: 3px;
  }
  .toggle:not(.enabled) {
    border-color: gray;
    border-style: dashed;
    filter: grayscale(1);
  }
  .toggle:hover {
    background: #facece;
  }
</style>
