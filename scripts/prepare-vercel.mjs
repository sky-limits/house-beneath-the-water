import { copyFile, mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const from = resolve('node_modules/p5/lib/p5.min.js');
const to = resolve('public/assets/vendor/p5.min.js');

await mkdir(dirname(to), { recursive: true });
await copyFile(from, to);
const info = await stat(to);
console.log(`vendored p5.js -> public/assets/vendor/p5.min.js (${info.size} bytes)`);
console.log('the house is ready for vercel.');
