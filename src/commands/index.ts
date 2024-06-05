import Joi from 'joi';

// * utils
import { validate, isWindows, toWindowsPath } from '../utils';

// * schemas
const stringSchema = Joi.string().min(1).required();

export const pwd = isWindows() ? 'cd' : 'pwd';

export const cd = (path: string) => {
  validate('path', path, stringSchema);
  path = toWindowsPath(path);

  return `cd ${path}`;
};
