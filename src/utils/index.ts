import os from 'os';

export const isWindows = () => os.platform() === 'win32';

export const parseCommand = (command: string): [string, string] => {
  command = command.trim();
  const firstSeparatorIndex = command.indexOf(' ');
  const commandParts = [
    command.slice(0, firstSeparatorIndex),
    command.slice(firstSeparatorIndex + 1),
  ];

  return [commandParts[0], commandParts[1]];
};
