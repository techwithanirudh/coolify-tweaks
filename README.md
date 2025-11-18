<div align="center">
  <img alt="banner" src="./apps/docs/public/banner.png" />
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

A userstyle that enhances Coolify's UI by applying opinionated tweaks, spacing, colors, and layout fixes, to make the UI more polished and user-friendly.

> **Note**: Coolify Tweaks is not affiliated with Coolify or its developers. It is a standalone project that styles the dashboard on your behalf.

**[View Screenshots →](https://coolify-tweaks.techwithanirudh.com/docs/style/screenshots)**

## Backstory

With Coolify v5's redesign set for 2026, I couldn't just sit around waiting for the visual upgrades. Coolify is really powerful, but a lot of people in the community feel like the UI gets in the way sometimes.

Instead of waiting for the official update, I decided to take things into my own hands. **Coolify Tweaks isn't a full redesign, it's a restyle.** It's a preview of what Coolify v5 _might_ look and feel like.

I cleaned up the spacing, adjusted the colors, tweaked the typography, and gave the layout a more modern vibe. It's still the same Coolify under the hood, just with a smoother, more intuitive interface.

## Installation

> **Note:** The bundled Nitro API in this Monorepo serves dynamic builds of the style, injecting [TweakCN](https://tweakcn.com) theme code on demand so every installation link stays up to date.

1. Install [Stylus](https://add0n.com/stylus.html).
2. Hit the badge below to add the style:

   [![install with Stylus](https://img.shields.io/badge/Install%20directly%20with-Stylus-116b59.svg?longCache=true&style=flat)](https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css)

   OR

   [![install from userstyles.world](https://img.shields.io/badge/Install%20from-userstyles.world-116b59.svg?longCache=true&style=flat)](https://userstyles.world/style/22850/coolify-enhanced-ui)

3. **Running Coolify on something other than `coolify.local`?**  
   Open the style’s _Settings_ pane in Stylus, then under **Custom included sites** add your host using a wildcard. For example:

   <img alt="Stylus Settings" src="./apps/docs/public/assets/stylus-settings.png" width="50%" />

   ```css
   *://192.168.0.123:8000/*
   ```

   Replace the IP and port above with your Coolify instance’s address, then click **Save**.

4. **Experiencing Style Issues?**
   If you notice style changes are slow, laggy, or not applying immediately, enable Instant Mode in Stylus. This forces styles to inject instantly on page load, eliminating delays.  
   <img alt="Stylus Instant Mode" src="./apps/docs/public/assets/stylus-instant-mode.png" width="50%" />

## Theming

Coolify Tweaks supports custom themes through integration with [TweakCN](https://tweakcn.com), allowing you to personalize your Coolify interface with beautiful color schemes and styling variations.

For detailed theming documentation, including installation methods, video guides, and troubleshooting, visit the [Theming documentation](https://coolify-tweaks.techwithanirudh.com/docs/style/theming).

## Contributing

Got an idea or feature request? [Open an issue](https://github.com/techwithanirudh/coolify-tweaks/issues) and let’s chat, or read the [contributing guide](CONTRIBUTING.md).

## License

Released under the [MIT](LICENSE) license.