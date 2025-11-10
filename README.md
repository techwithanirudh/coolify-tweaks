<div align="center">

  <img alt="" src="/.github/assets/cover.png" />

<h1>
  Coolify Tweaks
</h1>

<div>

[![version](https://img.shields.io/github/v/tag/techwithanirudh/coolify-tweaks.svg?label=version&style=flat)](https://github.com/techwithanirudh/coolify-tweaks/releases)
[![stars](https://img.shields.io/github/stars/techwithanirudh/coolify-tweaks.svg?style=flat)](https://github.com/techwithanirudh/coolify-tweaks/stargazers)
[![forks](https://img.shields.io/github/forks/techwithanirudh/coolify-tweaks.svg?color=007ec6&style=flat)](https://github.com/techwithanirudh/coolify-tweaks/network)
[![install with Stylus](https://img.shields.io/badge/Install%20directly%20with-Stylus-116b59.svg?longCache=true&style=flat)](https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css)
[![install from userstyles.world](https://img.shields.io/badge/Install%20from-userstyles.world-116b59.svg?longCache=true&style=flat)](https://userstyles.world/style/22850/coolify-enhanced-ui)

</div>

</div>

## About

Coolify Tweaks is a userstyle that layers polished spacing, typography, and colorwork on top of Coolify's dashboard. It keeps the UI familiar while smoothing out rough edges and lifting the entire control plane with subtle theming.

## Quick start

1. Install [Stylus](https://add0n.com/stylus.html) in the browser you use for Coolify.
2. Hit the Stylus badge above or visit `https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css` to install the latest build.
3. Add your instance's host to Stylus's **Custom included sites** when Coolify does not run on `coolify.local`.
4. Explore the [live documentation site](https://coolify-tweaks.techwithanirudh.com) for theme IDs, Traefik injection, screenshots, and troubleshooting tips.

## Repository context

- `apps/style` builds the Stylus userstyle, publishes CSS bundles, and ships the Nitro API assets.
- `apps/api` proxies assets so install badges always fetch the latest release without exposing GitHub tokens.
- `apps/docs` is this Fumadocs site and contains the Markdown, navigation, and assets for the official documentation.
- `packages/ui` offers shared primitives and theming helpers reused across the docs, web landing page, and any future demos.

## Contributing

Have a tweak idea? [Open an issue](https://github.com/techwithanirudh/coolify-tweaks/issues) and let’s discuss. When you contribute, document the change so it can be added to the docs site and showcased in the before/after gallery.

## License

Released under the [MIT](LICENSE) license.
