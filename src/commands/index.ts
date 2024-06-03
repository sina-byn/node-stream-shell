import chalk from 'chalk';

// * utils
import { isWindows } from '../utils';

export const pwd = isWindows() ? 'cd' : 'pwd';

export const cd = (path: string) => {
  if (typeof path !== 'string') {
    throw new Error(chalk.redBright('you must specify a path for the cd command'));
  }

  return `cd ${path}`;
};
