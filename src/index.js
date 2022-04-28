import { parse } from 'svelte/compiler';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { getLocator } from 'locate-character';
import { launchEditor } from './launch-editor.js';
import Inspector from './Inspector.svelte';

export default function () {
  return {
    name: 'vite-plugin-svelte-inspector',
    enforce: 'pre',
    apply: 'serve',
    transform(code, id) {
      if (id.endsWith('.svelte')) {
        const str = new MagicString(code);
        const locate = getLocator(code);
        const ast = parse(code);
        walk(ast.html, {
          enter(node) {
            if (node.type === 'Element') {
              const start = node.start + node.name.length + 1;
              const { line, column } = locate(node.start);
              str.appendLeft(
                start,
                ` data-svelte-inspect="${id}:${line + 1}:${column + 1}"`
              );
            }
          },
        });
        return {
          code: str.toString(),
          map: str.generateMap({
            source: id,
            file: 'svelte-inspector.js.map',
            includeContent: true,
          }),
        };
      } else if (id.endsWith('/svelte-hmr/runtime/index.js')) {
        // NOTE: can't find a place to inject this script, cheat by hitch along the hmr endpoint
        return (
          code +
          '\n' +
          Inspector +
          `
        new $({ target: document.body });
      `
        );
      }
      return code;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'https://localhost');
        if (url.pathname === '/__svelte-inspector') {
          const open = url.searchParams.get('open');
          if (!open) {
            res.statusCode = 500;
            res.end(
              'vite-plugin-svelte-inspector: required query param "open" is missing.'
            );
          } else {
            const parts = open.split(':');
            const column = +parts.pop();
            const line = +parts.pop();
            launchEditor(parts.join(':'), line, column);
            res.end();
          }
        } else {
          next();
        }
      });
    },
  };
}
