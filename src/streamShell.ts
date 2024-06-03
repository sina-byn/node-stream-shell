import { exec as _exec } from 'child_process';
import { Readable } from 'stream';

// * utils
import logger from './utils/logger';

// * data
const handlers = {
  cd: (path: string) => process.chdir(path),
};

type StreamShell = {
  (...commands: string[]): { stdout?: Readable; stderr?: Readable };
};

const streamShell: StreamShell = (...commands: string[]) => {
  if (!commands.length) {
    logger.warn('no commands were specified');
    return {};
  }

  const stdout = new Readable({ read() {} });
  const stderr = new Readable({ read() {} });
  let index = 0;

  const exec = (command: string) => {
    if (!command) {
      stdout.push(null);
      stderr.push(null);
      return;
    }

    const cp = _exec(command, err => {
      if (err) {
        stdout.push(null);
        stderr.push(null);
        return;
      }

      command = command.trim();
      const firstSeparatorIndex = command.indexOf(' ');
      const commandParts = [
        command.slice(0, firstSeparatorIndex),
        command.slice(firstSeparatorIndex + 1),
      ];

      const cmd = commandParts[0] as keyof typeof handlers;
      handlers[cmd]?.(commandParts[1]);

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
