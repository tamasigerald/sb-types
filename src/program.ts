import { Command } from "commander";
import clear from "clear";
import figlet from "figlet";

import { getName, getVersion, logger } from "@/utils";

export const program = new Command();

export const initProgram = async () => {
  clear();

  logger.info(figlet.textSync(getName(), { horizontalLayout: "full" }), true);
  logger.info(`version: ${getVersion()}`, true);

  program
    .version(getVersion())
    .description("An example CLI for managing a directory")
    .option("-o, --overwrite", "overwrite the output file")
    .option("-env, --env-path <path>", "path to the env file")
    .option("-p, --prettier", "prettier print the output file");

  program.parse(process.argv);
};
