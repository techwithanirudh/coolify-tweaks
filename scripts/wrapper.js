#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const cssFile = 'dist/main.css';
const css = readFileSync(cssFile, 'utf8');

const wrappedCss = `
@-moz-document url-prefix("http://coolify.local:8000/"),
               url-prefix("https://coolify.local:8000/"),
               url-prefix("http://app.coolify.io/"),
               url-prefix("https://app.coolify.io/"),
               regexp(".*://coolify\\.local:8000/.*"),
               regexp(".*://app\\.coolify\\.io/.*") {
${css}
}`;

writeFileSync(cssFile, wrappedCss);
console.log('✅ Added @-moz-document wrapper to CSS');
