# coolify-tweaks

## 3.5.2

### Patch Changes

- refactor: radius logic

## 3.5.1

### Patch Changes

- refactor: update system

## 3.5.0

### Minor Changes

- fix: tweakcn

## 3.4.0

### Minor Changes

- ### Styling Cleanup and UX Polish

  This update is all about giving Coolify a nice visual makeover—cleaner, smoother styles and just an all-around better feel:

  #### 🎨 Smarter Colors & Themes
  - **Custom Theming**: The new version now supports the ShadCN theming spec, allowing you to **fully customize** your Coolify instance to look unique. Customize using [tweakcn.com](https://tweakcn.com/).
  - Tidied up the color variables for clearer theming and better contrasts
  - Improved semantic tokens so it's actually easy to tell what's going on
  - Dark mode looking much slicker (thanks to better handling with color-mix)
  - Renamed color tokens to simpler stuff like `foreground` and `muted-foreground`—makes sense now!

  #### 🧩 Component Polish
  - Sidebar layout cleaned up, way more consistent
  - Inputs, buttons, selects—all have nicer focus and hover interactions

  #### ✨ UI Improvements
  - Tables fixed up and sidebar colors adjusted for better harmony
  - Deployment cards styled properly, plus a nice cleanup in `misc.scss`
  - Navbar links are now easier on the eyes
  - Hover effects got a sweet upgrade and inputs give better feedback
  - Logs are now using monospaced fonts

  #### 🛠️ Code Cleanup & Consistency
  - Border radius and padding consistent throughout—looks neat
  - Hover and focus styles tightened up globally

  #### 🐛 Little (but important) Fixes
  - Font issues squashed—no more weird glitches
  - Fixed some pesky typos in class selectors
  - Labels now have proper spacing and feel uniform
  - Monaco editor respects radius and overflow properly now

  This update smooths everything out and makes Coolify feel way more unified—nothing breaks, just a nicer, themeable experience overall.

## 3.3.1

### Patch Changes

- feat: add new font and update colors, and radius

## 3.3.0

### Minor Changes

- feat: redesign dashboard project cards

## 3.2.3

### Patch Changes

- fix: select styling

## 3.2.2

### Patch Changes

- fix: icon rendering for the feedback icon

## 3.2.1

### Patch Changes

- use phosphor icons for the sidebar

## 3.2.0

### Minor Changes

- refactor selector logic to be easier to read

## 3.1.0

### Minor Changes

- Enhanced CI infrastructure and developer experience
  - Added comprehensive spell checking with cspell configuration
  - Consolidated CI workflows into a single comprehensive workflow with TypeScript, Prettier, and spelling checks
  - Added reusable GitHub Actions setup action for consistent environment configuration
  - Added GitHub funding configuration to support project development
  - Improved release workflow by switching trigger branch from main to dev
  - Added engine requirements and spell checking script to package.json

## 3.0.3

### Patch Changes

- fix: release cycle

## 3.0.2

### Patch Changes

- Fixes release workflow for changesets.

## 3.0.1

### Patch Changes

- Migrate to Changeset CLI for better version management and changelog generation. This improves the development workflow by providing automated changelog generation and semantic versioning.
