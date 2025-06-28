export interface Config {
  name: string;
  version: string;
  namespace: string;
  updateURL: string;
  description: string;
  license: string;
  domains: string[];
  regexPatterns: string[];
}

export const config: Config = {
  name: 'Coolify Enhanced UI',
  version: '2.0.1',
  namespace: 'techwithanirudh',
  updateURL: 'https://github.com/techwithanirudh/coolify-tweaks/raw/main/tweaks.user.styl',
  description:
    'Extra spacing, soft rounded corners, subtle shadows, and fully token-driven colour themes for Coolify.',
  license: 'MIT',

  // Target domains for @-moz-document
  domains: [
    'http://coolify.local:8000/',
    'https://coolify.local:8000/',
    'http://app.coolify.io/',
    'https://app.coolify.io/',
  ],

  // Regex patterns for @-moz-document
  regexPatterns: ['.*://coolify\\.local:8000/.*', '.*://app\\.coolify\\.io/.*'],
};
