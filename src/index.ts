#!/usr/bin/env node

import dotenv from "dotenv";

import { init } from "@/init";
import { initProgram } from "@/program";
import { getProgramOptions, logger } from "@/utils";

global.logger = logger;

await initProgram();

const envPath = getProgramOptions().envPath || ".env";

dotenv.config({ path: envPath });

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  logger.info("Running in development mode", true);
}

await init();

export { ConfigOptions } from "@/types";
