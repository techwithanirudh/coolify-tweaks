# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

## How to use

### 1. Create a changeset

When you make changes that should be included in the next release, create a changeset:

```bash
bun changeset
```

This will:

- Ask you what type of change this is (major, minor, patch)
- Ask you to write a summary of your changes
- Create a markdown file in `.changeset/` with your change description

### 2. Release a new version

When you're ready to release:

```bash
bun run version  # Updates package.json version and generates CHANGELOG.md
bun run release  # Builds the project and creates git tags
```

## Change Types

- **Major (Breaking)**: API changes, major feature rewrites
- **Minor (Feature)**: New features, new components, significant improvements
- **Patch (Fix)**: Bug fixes, small improvements, documentation updates

## Example Workflow

1. Make your changes to the codebase
2. Run `bun changeset` and describe your changes
3. Commit your changes including the new changeset file
4. When ready to release, run `bun run version` to update versions
5. Commit the version changes
6. Run `bun run release` to publish and tag the release
