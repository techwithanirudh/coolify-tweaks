import { watch } from 'fs/promises';
import { generateUserStyle } from './utils/userstyle.ts';

await generateUserStyle({
  outputFile: 'dist/main.user.css',
});

console.log('👀 Watching for changes in dist/main.css...');

const watcher = watch('dist/main.css');
for await (const event of watcher) {
  if (event.eventType === 'change') {
    await new Promise(resolve => setTimeout(resolve, 100));
    await generateUserStyle({
      outputFile: 'dist/main.user.css',
    });
  }
}
