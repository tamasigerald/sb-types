#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { development, production } from './mocks';
import { mkdirp } from 'mkdirp';
import dotenv from 'dotenv';
import prettier from 'prettier';

const program = new Command();

const pkg = require(path.join(__dirname, '../package.json'));
const version = pkg.version;
const name = pkg.name;

clear();

console.info(chalk.blue(figlet.textSync(name, { horizontalLayout: 'full' })));
console.info(chalk.blue(`version: ${version}`));

program
  .version('1.0.0')
  .description('An example CLI for managing a directory')
  .option('-d, --debug', 'local debug mode')
  .option('-ovd, --overwrite', 'overwrite the output file')
  .option('-env, --env-path <path>', 'path to the env file')
  .option('-p, --pretty', 'pretty print the output file');

program.parse(process.argv);

const envPath = program.opts().envPath || '.env';

dotenv.config({ path: envPath });

export type ConfigOptions = {
  /**
   * Storyblok API options
   * @example {
   *  endpoint: process.env.STORYBLOK_ENDPOINT,
   *  token: process.env.STORYBLOK_TOKEN
   * }
   */
  api: {
    endpoint: string;
    token: string;
  };
  /**
   * List of datasources to fetch
   * @example ["countries", "languages"]
   */
  datasources: string[];
  /**
   * Path to the output file
   * @default "./types/sb-types.ts"
   */
  outputPath?: string;
};

export const CONFIG_FILENAME = 'sb-types.config.js';

const DEFAULT_PRETTIER_CONFIG = {
  parser: 'typescript',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
} satisfies prettier.Options;

const getPrettierConfig = async () => {
  const prettierConfig = await prettier.resolveConfig(process.cwd());
  return prettierConfig || DEFAULT_PRETTIER_CONFIG;
};

// get the config file from the current working directory
export const getConfig = async () => {
  const configPath = path.join(process.cwd(), CONFIG_FILENAME);

  try {
    const config = await import(configPath);

    return config.default as ConfigOptions;
  } catch (error) {
    console.error(chalk.red(error));
    return null;
  }
};

// check if the config file exists in the current working directory, else create it
export const checkConfig = async (): Promise<ConfigOptions> => {
  console.info(chalk.blue('Checking config file...'));
  const config = await getConfig();

  if (!config) {
    console.info(chalk.red('Config file not found, creating one...'));
    const prettierConfig = await getPrettierConfig();
    fs.writeFileSync(
      path.join(process.cwd(), CONFIG_FILENAME),
      prettier.format(
        !program.opts().debug ? production : development,
        prettierConfig
      )
    );

    console.info(
      chalk.green('Config file created! Please fill in the required fields.')
    );
    return process.exit(0);
  }

  console.error(chalk.green('Config file found!'));
  return config;
};

const fetchStoryblokDatasource = async (
  endpoint: string,
  token: string,
  datasource: string | string[]
) => {
  const request = await fetch(
    `${endpoint}/datasource_entries?token=${token}&datasource=${datasource}`
  );
  const response = await request.json();
  return response;
};

type DatasourceResponse = {
  datasource_entries: [
    {
      id: number;
      name: string;
      value: string;
      dimension_value: null | string;
    }
  ];
};

const parseDatasourceResponse = (response: DatasourceResponse, key: string) => {
  return `\nexport type ${
    // string is like "global-translations" => "GlobalTranslations"
    key
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  } = '${response.datasource_entries
    .map(({ name }: { name: string }) => name)
    .sort()
    .join("' | '")}';`;
};

const init = async () => {
  const config = (await checkConfig()) as ConfigOptions;

  if (!config.api || !config.api?.endpoint || !config.api?.token) {
    console.error(chalk.red('Missing API config'));
    console.error(
      chalk.red('Please add an API config to your sb-types.config.json file')
    );

    return process.exit(1);
  }

  if (!config.datasources || !config.datasources?.length) {
    console.error(chalk.red('Missing datasources'));
    console.error(
      chalk.red(
        'Please add a list of datasources to your sb-types.config.json file'
      )
    );

    return process.exit(1);
  }

  if (config) {
    console.info(chalk.blue('Fetching datasources...'));

    const promises = config.datasources.map((datasource) =>
      fetchStoryblokDatasource(
        config.api.endpoint,
        config.api.token,
        datasource
      )
    );

    const responses = await Promise.all(promises);

    responses.forEach((response, index) => {
      console.info(
        chalk.green(`Datasource ${config.datasources[index]} fetched!`)
      );

      const filePath = config.outputPath || './types/sb-types.ts';

      // remove the file name from the path, then create the directory if it doesn't exist
      const dirPath = filePath.split('/').slice(0, -1).join('/');
      mkdirp.sync(dirPath); // this will create the directory if not exists

      // if file exists or no overwrite flag, append to it instead of overwriting it
      if (fs.existsSync(filePath) && !program.opts().overwrite) {
        console.info(chalk.blue('Appending to file...'));

        if (program.opts().pretty) {
          console.info(chalk.blue('Formatting file...'));
          const formatted = prettier.format(
            parseDatasourceResponse(response, config.datasources[index]),
            {
              parser: 'typescript',
              semi: true,
              singleQuote: true,
              trailingComma: 'es5',
              printWidth: 120,
            }
          );
          fs.appendFileSync(filePath, formatted);
        } else {
          fs.appendFileSync(
            path.join(
              process.cwd(),
              config.outputPath || './types/sb-types.ts'
            ),
            parseDatasourceResponse(response, config.datasources[index])
          );
        }

        return;
      } else {
        console.info(chalk.blue('Writing to file...'));

        if (program.opts().pretty) {
          console.info(chalk.blue('Formatting file...'));
          const formatted = prettier.format(
            parseDatasourceResponse(response, config.datasources[index]),
            {
              parser: 'typescript',
              semi: true,
              singleQuote: true,
              trailingComma: 'es5',
              printWidth: 120,
            }
          );
          fs.writeFileSync(filePath, formatted);
        } else {
          fs.writeFileSync(
            path.join(
              process.cwd(),
              config.outputPath || './types/sb-types.ts'
            ),
            parseDatasourceResponse(response, config.datasources[index])
          );
        }
      }
    });
  }
};

init();
