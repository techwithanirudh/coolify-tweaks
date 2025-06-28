export const config = {
  name: 'Coolify Enhanced UI',
  version: '2.0.1',
  namespace: 'techwithanirudh',
  updateURL: 'https://github.com/techwithanirudh/coolify-tweaks/raw/main/tweaks.user.styl',
  description:
    'Extra spacing, soft rounded corners, subtle shadows, and fully token-driven colour themes for Coolify.',
  license: 'MIT',
  domains: {
    regex: ['.*://coolify\\.local:8000/.*', '.*://app\\.coolify\\.io/.*'],
    exact: [
      'http://coolify.local:8000/',
      'https://coolify.local:8000/',
      'http://app.coolify.io/',
      'https://app.coolify.io/',
    ],
  },
};
