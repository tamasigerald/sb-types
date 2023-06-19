import prettier from "prettier";

import { DEFAULT_PRETTIER_CONFIG } from "@/constants";

export const getPrettierConfig = async () => {
  const prettierConfig = await prettier.resolveConfig(process.cwd());
  return prettierConfig || DEFAULT_PRETTIER_CONFIG;
};

export const prettierFormat = async (code: string) => {
  const prettierConfig = await getPrettierConfig();
  return prettier.format(code, prettierConfig);
};
