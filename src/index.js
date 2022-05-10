import Inspector from './Inspector.svelte';

export default function ({enabled=true}) {
  return {
    name: 'vite-plugin-svelte-inspector',
    enforce: 'pre',
    apply: 'serve',
    transform(code, id) {
      if (id.endsWith('/svelte-hmr/runtime/index.js')) {
        // NOTE: can't find a place to inject this script, cheat by hitch along the hmr endpoint
        return (
          code +
          '\n' +
          Inspector +
          `
        new $({ target: document.body, props: { enabled: ${enabled} } });
      `
        );
      }
      return code;
    },
  };
}
