import { nodeResolve } from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  plugins: [
    svelte({ emitCss: false }),
    {
      transform(code, id) {
        if (id.endsWith('.svelte')) {
          return (
            'export default `' +
            code
              .replace('export default ', 'const $ = ')
              .replace(/\${/g, '\\${')
              .replace(/`/g, '\\`') +
            '`'
          );
        }
        return code;
      },
    },
    nodeResolve(),
  ],
  external: ['svelte/compiler'],
};
