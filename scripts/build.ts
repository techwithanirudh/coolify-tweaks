import { generateUserStyle } from './utils/userstyle.ts';

await generateUserStyle({
  exitOnError: true,
  outputFile: 'dist/main.user.css',
});
