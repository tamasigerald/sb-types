import prettier from "prettier";
import { ConfigOptions } from "@/types";

export const CONFIG_FILENAME = "sb-types.config.cjs";
export const DEFAULT_CONFIG_PATH = `./${CONFIG_FILENAME}` as const;

export const DEFAULT_OUTPUT_FILENAME = "sb-types.ts";
export const DEFAULT_OUTPUT_PATH = `./types/${DEFAULT_OUTPUT_FILENAME}` as const;

export const DEFAULT_CONFIG: ConfigOptions = {
  api: {
    endpoint: "https://api.storyblok.com/v2/cdn",
    token: "",
  },
  datasources: [],
  outputPath: DEFAULT_OUTPUT_PATH,
};

export const DEFAULT_PRETTIER_CONFIG = {
  parser: "typescript",
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  printWidth: 80,
} satisfies prettier.Options;
