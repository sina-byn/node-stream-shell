import os from 'os';
import path from 'path';
import chalk from 'chalk';

// * types
import type { Schema } from 'joi';

export const isWindows = () => os.platform() === 'win32';

export const toWindowsPath = (p: string) => p.trim().split(path.posix.sep).join(path.sep);

export const validate = (label: string, input: unknown, schema: Schema) => {
  const { error } = schema.label(label).validate(input);

  if (!error) return;
  const message = error.details[0].message;
  throw new Error(chalk.redBright(message));
};

export const parseCommand = (command: string): [string, string] => {
  command = command.trim();
  const firstSeparatorIndex = command.indexOf(' ');
  const commandParts = [
    command.slice(0, firstSeparatorIndex),
    command.slice(firstSeparatorIndex + 1),
  ];

  return [commandParts[0], commandParts[1]];
};
