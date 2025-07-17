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

## Installation

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

### Troubleshooting Themes

**Theme not applying?**

- Ensure you're using the correct theme ID
- Try refreshing the page or restarting your browser

**Mixed styling issues?**

- Clear your browser cache
- Disable and re-enable the style in Stylus
- Make sure you're not running multiple conflicting styles

## Contributing

Got an idea or feature request? [Open an issue](https://github.com/techwithanirudh/coolify-tweaks/issues) and let’s chat.

## License

Released under the [MIT](license) license.
