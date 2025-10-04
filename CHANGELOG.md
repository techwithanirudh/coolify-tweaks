# coolify-tweaks

## 3.7.7

### Patch Changes

- fix: search bar alignment

## 3.7.6

### Patch Changes

- fix: match deployment item colors

## 3.7.5

### Patch Changes

- fix: styles broken due to new coolify update

## 3.7.4

### Patch Changes

- fix: tweak gear icon

## 3.7.3

### Patch Changes

- feat: replace theme-selector with settings-menu and add styling for settings dropdown

## 3.7.2

### Patch Changes

- feat: add new icons for theme selector; fix: search icon position for changelog modal; fix: highlight settings button on active (dropdownOpen)

## 3.7.1

### Patch Changes

- refactor: theme selector logic for new settings menu

## 3.7.0

### Minor Changes

- feat: add spinner and dropdown components with enhanced styling
  - Added new spinner component with proper theming
  - Implemented dropdown component with hover and focus states
  - Refactored box styles for better consistency
  - Enhanced onboarding page layout and styling
  - Removed !important declarations for better maintainability
  - Improved UI component organization and theming

## 3.6.4

### Patch Changes

- fix: destructive colors & fix width inconsistencies

## 3.6.3

### Patch Changes

- Refactor user style processing with consolidated plugin architecture:
  - Consolidated two separate plugins into single userstyle-processor.ts
  - Improved CSS structure with proper @import placement inside @-moz-document wrapper
  - Clean PostCSS plugin for handling import rules placement
  - Removed redundant code and simplified build pipeline
  - Better maintainability and cleaner output

## 3.6.2

### Patch Changes

- fix: improve theme selector button styling and functionality
  - Adjust button background and SVG fill for improved theme dropdown visibility
  - Update hover state styles for theme selector button to enhance visual feedback
  - Support all theme states for improved functionality
  - Remove unnecessary styles for cleaner design

## 3.6.1

### Patch Changes

- Fix multiple UI improvements and documentation updates:
  - Enhanced changeset creation instructions for AI agents
  - Added comprehensive versioning rules and release process documentation
  - Improved SVG transformations for consistent alignment in resource images
  - Updated theme selector button to support all theme states
  - Cleaned up unnecessary styles from theme selector button
  - Refined README backstory section for better clarity
  - Updated README with enhanced project backstory and UI descriptions

## 3.6.0

### Minor Changes

- # Refactor User Style Processing Architecture

  This release introduces a significant architectural improvement to how user styles are processed and generated, resulting in cleaner, more maintainable code and better CSS output.

  ## Major Changes

  ### Improved CSS Structure
  - **Fixed @import rule placement** - imports now properly appear inside the `@-moz-document` wrapper instead of outside
  - **Correct CSS ordering** - UserStyle header → @charset → @-moz-document wrapper → @imports → CSS content

  ## What This Means for Users

  The generated user styles now have proper CSS structure with imports correctly scoped within domain targeting. This ensures better compatibility with user style managers and more reliable application of tweaks across different Coolify environments.

  ## Breaking Changes

  None - this is purely an internal architectural improvement that maintains the same output functionality while improving code quality and maintainability.

## 3.5.4

### Patch Changes

- fix: deployments section ui

## 3.5.3

### Patch Changes

- fix: allow pointer events for disabled inputs

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
