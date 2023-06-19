import { DEFAULT_CONFIG } from "@/constants";

export const development = `// @ts-check
/** @type {import("./dist").ConfigOptions} */
module.exports = ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`;

export const production = `// @ts-check
/** @type {import("sb-types").ConfigOptions} */
module.exports = ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`;
