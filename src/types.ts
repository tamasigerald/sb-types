export type DatasourceResponse = {
  datasource_entries: [
    {
      id: number;
      name: string;
      value: string;
      dimension_value: null | string;
    }
  ];
};

export type ConfigDatasource = {
  /** Storyblok datasource name */
  name: string;
  /** Path to the output file */
  outputFile?: string;
  /** Number of items to fetch
   * @default 250
   */
  amount?: number;
};

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
   * @example [
   * {
   * name: "global-translations",
   * outputFile: "./types/global-translations.ts",
   * amount: 250,
   * },
   */
  datasources: ConfigDatasource[];
  /**
   * Path to the output file. If not specified, the default path will be used
   * Different datasources will be written to different files if specified
   * @default "./types/sb-types.ts"
   */
  outputPath?: string;
};

export type ProgramOptions = {
  /** Overwrite the output file
   * @default false
   * */
  overwrite: boolean;
  /** Path to env file to load environment variables from
   * @default "./.env"
   * */
  envPath: string;
  /** Run prettier on generated files
   * @default false
   */
  prettier: boolean;
};
