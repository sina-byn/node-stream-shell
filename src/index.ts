import streamShell from './streamShell';
import { cd, pwd } from './commands';

const { stdout, stderr } = streamShell(cd('src'), pwd, cd('..'), pwd, 'git status', 'git log');

stdout!.on('data', chunk => console.log(chunk.toString()));

stdout!.on('end', () => console.log('data - end'));

stderr!.on('data', chunk => console.log(chunk.toString()));

stderr!.on('end', () => console.log('err - end'));
