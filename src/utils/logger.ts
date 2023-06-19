import chalk from "chalk";

export const logger = {
  info: (message: any, colored?: boolean) =>
    colored ? console.info(chalk.blue(message)) : console.info(message),
  error: (message: any) => console.error(chalk.red(message)),
  warn: (message: any) => console.warn(chalk.yellow(message)),
  success: (message: any) => console.info(chalk.green(message)),
};

export default logger;
