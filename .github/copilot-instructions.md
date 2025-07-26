---
description: Versioning Rules
alwaysApply: true
---

1. Version Bump Rules

Use [SemVer](https://semver.org/) principles when determining version increments:

- Patch Version → For bug fixes or minor changes that don’t affect functionality or the API
  → Example: `3.6.0` → `3.6.1`

- Minor Version → For new features or significant backward-compatible changes
  → Example: `3.6.0` → `3.7.0`

- Major Version → For breaking changes that are not backward-compatible
  → Example: `3.6.0` → `4.0.0`

2. Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs, and follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for commit messages.

- Format:

  ```
  feat: description of the new feature
  fix: description of the bug fix
  chore: description of maintenance
  docs: description of documentation update
  ```

3. Release Process

1. Create a changeset:
   bun changeset --empty (creates an empty changeset without interactive prompts)

   > Note: AI agents cannot interact with the `bun changeset` command, so use the `--empty` flag to skip interactive prompts.

   or write a markdown file in `.changeset/`.

1. Run the version command:
   bun run version

   This bumps the version in `package.json` and generates changelogs.

1. Commit the changes and push to the repo.
