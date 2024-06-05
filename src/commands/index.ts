import Joi from 'joi';

// * utils
import { validate, isWindows, toWindowsPath } from '../utils';

// * schemas
const stringSchema = Joi.string().min(1).required();

// * data
const cpFlags: Options = {
  a: '/E /I /H /K /O /X /Y /C',
  r: '/E',
  f: '/Y',
  u: '/D',
  i: '',
};

// * types
type Options = Record<string, string>;

export const pwd = isWindows() ? 'cd' : 'pwd';

export const cd = (path: string) => {
  validate('path', path, stringSchema);
  path = toWindowsPath(path);

  return `cd ${path}`;
};

export const cp = (src: string, dest: string, flags?: string) => {
  validate('src', src, stringSchema);
  validate('dest', dest, stringSchema);
  validate('flags', flags, Joi.string().min(1));

  src = toWindowsPath(src);
  dest = toWindowsPath(dest);

  const command = isWindows() ? 'xcopy' : 'cp';
  if (!flags) return `${command} ${src} ${dest}`;

  flags = flags.trim();
  if (flags.startsWith('-')) flags = flags.slice(1);

  if (isWindows()) {
    const flagsArr = [...new Set(flags.split(''))];

    // prettier-ignore
    flags = [
      ...new Set(
        flagsArr.map(f => cpFlags[f].split(/\s+/)).flat(1)
      )
    ].join(' ');
  }

  if (!isWindows()) flags = `-${flags}`;

  return `${command} ${src} ${dest} ${flags}`;
};
