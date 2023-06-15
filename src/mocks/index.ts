import { ConfigOptions } from '..';

const DEFAULT_CONFIG: ConfigOptions = {
  api: {
    endpoint: 'https://api.storyblok.com/v2/cdn',
    token: '',
  },
  datasources: [],
  outputPath: './types/sb-types.ts',
};

export const development = `// @ts-check
/** @type {import("./dist").ConfigOptions} */
module.exports = ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`;

export const production = `// @ts-check
/** @type {import("sb-types").ConfigOptions} */
module.exports = ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`;
