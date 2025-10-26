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

A userstyle that enhances Coolify's UI by applying opinionated tweaks, spacing, colors, and layout fixes, to make the UI more polished and user-friendly.

**[View Screenshots →](SCREENSHOTS.md)**

## Backstory

With Coolify v5's redesign set for 2026, I couldn't just sit around waiting for the visual upgrades. Coolify is really powerful, but a lot of people in the community feel like the UI gets in the way sometimes.

Instead of waiting for the official update, I decided to take things into my own hands. **Coolify Tweaks isn't a full redesign, it's a restyle.** It's a preview of what Coolify v5 _might_ look and feel like.

I cleaned up the spacing, adjusted the colors, tweaked the typography, and gave the layout a more modern vibe. It's still the same Coolify under the hood, just with a smoother, more intuitive interface.

## Installation

> **Note:** Coolify Tweaks is distributed through a custom API ([coolify-tweaks-api](https://github.com/techwithanirudh/coolify-tweaks-api)) that dynamically embeds [TweakCN](https://tweakcn.com) theme code into the style, enabling seamless theme integration.

1. Install [Stylus](https://add0n.com/stylus.html).
2. Hit the badge below to add the style:

   [![install with Stylus](https://img.shields.io/badge/Install%20directly%20with-Stylus-116b59.svg?longCache=true&style=flat)](https://coolify-tweaks-api.techwithanirudh.com/release/latest/?asset=main.user.css)

   OR

   [![install from userstyles.world](https://img.shields.io/badge/Install%20from-userstyles.world-116b59.svg?longCache=true&style=flat)](https://userstyles.world/style/22850/coolify-enhanced-ui)

3. **Running Coolify on something other than `coolify.local`?**  
   Open the style’s _Settings_ pane in Stylus, then under **Custom included sites** add your host using a wildcard. For example:

   <img alt="Stylus Settings" src="/.github/assets/stylus-settings.png" width="50%" />

   ```css
   *://192.168.0.123:8000/*
   ```

   Replace the IP and port above with your Coolify instance’s address, then click **Save**.

4. **Experiencing Style Issues?**
   If you notice style changes are slow, laggy, or not applying immediately, enable Instant Mode in Stylus. This forces styles to inject instantly on page load, eliminating delays.  
   <img alt="Stylus Instant Mode" src="/.github/assets/stylus-instant-mode.png" width="50%" />

## Theming

Coolify Tweaks supports custom themes through integration with [TweakCN](https://tweakcn.com), allowing you to personalize your Coolify interface with beautiful color schemes and styling variations.

### How to Apply a Custom Theme

1. **Browse Available Themes**  
   Visit [TweakCN](https://tweakcn.com/editor/theme) to explore available themes or create your own custom theme.

2. **Get the Theme ID**  
   When you find a theme you like:
   - Click the **Share** button on the theme
   - Copy the theme ID (e.g., `bubblegum`, `claude`, or `cmd1ndlp3000504l24z7vgywd`)

3. **Install with Theme**  
   Use the themed installation URL in Stylus:

   ```
   https://coolify-tweaks-api.techwithanirudh.com/release/latest/?theme=THEME_ID&asset=main.user.css
   ```

   Replace `THEME_ID` with your copied theme identifier.

   > **Note:** The theme query parameter should come first, as Stylus identifies user styles by URLs ending with `user.css`

### Video Guide

If you prefer watching instead, here’s a short walkthrough:

[![Watch the video](https://i.ibb.co/FLxtT5Y2/Clean-Shot-2025-10-24-at-11-14-01-2x.png)](https://fixupx.com/AnirudhWith/status/1981595703978713311.mp4)

### Troubleshooting Themes

**Theme not applying?**

- Ensure you're using the correct theme ID
- Try refreshing the page or restarting your browser

**Mixed styling issues?**

- Clear your browser cache
- Disable and re-enable the style in Stylus
- Make sure you're not running multiple conflicting styles

## Repo Context

This repository is implemented as a Turborepo workspace so the userstyle, API proxy, and future tooling can evolve together.

- `apps/style` holds the Sass build pipeline that compiles the userstyle and publishes assets via Changesets.
- `apps/api` is a lightweight Nitro service that proxies release assets for easier distribution.
- `apps/web` is a Next.js playground used to test UI integrations while sharing utilities from `packages`.
- Shared tooling lives under `tooling/*` for linting, formatting, and TypeScript configuration, keeping all packages aligned.

## Contributing

Got an idea or feature request? [Open an issue](https://github.com/techwithanirudh/coolify-tweaks/issues) and let’s chat, or read the [contributing guide](CONTRIBUTING.md).

## License

Released under the [MIT](LICENSE) license.
