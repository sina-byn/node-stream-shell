import { exec as _exec } from 'child_process';
import { Readable } from 'stream';
import os from 'os';

// * utils
import logger from './utils/logger';
import { parseCommand } from './utils';

// * data
const handlers = {
  cd: (path: string) => process.chdir(path),
};

// * types
type ShellCommand = string | Record<NodeJS.Platform, string>;

type StreamShell = {
  (...commands: ShellCommand[]): { stdout?: Readable; stderr?: Readable };
};

const streamShell: StreamShell = (...commands: ShellCommand[]) => {
  if (!commands.length) {
    logger.warn('no commands were specified');
    return {};
  }
  
  const stdout = new Readable({ read() {} });
  const stderr = new Readable({ read() {} });
  const initialDir = process.cwd();
  let index = 0;

  const exec = (command: ShellCommand) => {
    if (!command) {
      process.chdir(initialDir);
      stdout.push(null);
      stderr.push(null);
      return;
    }

    if (typeof command !== 'string') {
      const osPlatform = os.platform();
      if (!(osPlatform in command)) throw new Error(`no command was specified for ${osPlatform}`);
      command = command[osPlatform];
    }

    const cp = _exec(command, err => {
      if (err) {
        process.chdir(initialDir);
        stdout.push(null);
        stderr.push(null);
        return;
      }

      const parsedCommand = parseCommand(command as string);
      const cmd = parsedCommand[0] as keyof typeof handlers;
      handlers[cmd]?.(parsedCommand[1]);

      exec(commands[++index]);
    });

    cp.stdout!.on('data', chunk => {
      stdout.push(chunk);
    });

    cp.stderr!.on('data', chunk => {
      stderr.push(chunk);
    });
  };

  exec(commands[index]);

  return { stdout, stderr };
};

export default streamShell;
