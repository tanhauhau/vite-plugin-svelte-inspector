![logo](./src/logo.png)

# vite-plugin-svelte-inspector

## Installation

```sh
# pnpm
pnpm install vite-plugin-svelte-inspector -D

# yarn
yarn add vite-plugin-svelte-inspector -D

# npm
npm install vite-plugin-svelte-inspector -D
```

## Usage

### Add it to your SvelteKit project

```js
// filename: svelte.config.js

// for vue2
import Inspector from 'vite-plugin-svelte-inspector';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // ...
    vite: {
      plugins: [Inspector()],
    },
  },
};

export default config;
```

### License

[MIT](/LICENSE)
