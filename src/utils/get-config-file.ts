import fs from "node:fs";
import path from "node:path";

import { ConfigOptions } from "@/types";
import { CONFIG_FILENAME } from "@/constants";
import { development, production } from "@/mocks";
import { isDev, prettierFormat } from "@/utils";

export const getFile = async (filePath: string) => {
  try {
    const file = await import(filePath);
    return file.default as ConfigOptions;
  } catch (error) {
    return null;
  }
};

// get the config file from the current working directory
export const getConfig = async () =>
  await getFile(path.join(process.cwd(), CONFIG_FILENAME));

// check if the config file exists in the current working directory, else create it
export const checkConfigFile = async (): Promise<ConfigOptions> => {
  logger.info("Checking config file...");
  const config = await getConfig();

  if (!config) {
    logger.error("Config file not found, creating one...");
    fs.writeFileSync(
      path.join(process.cwd(), CONFIG_FILENAME),
      await prettierFormat(!isDev() ? production : development)
    );

    logger.success("Config file created! Please fill in the required fields.");
    return process.exit(0);
  }

  logger.success("Config file found!");
  return config;
};
