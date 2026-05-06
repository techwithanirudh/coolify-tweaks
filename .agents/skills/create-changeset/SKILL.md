---
name: create-changeset
description: Analyze git changes and create changesets for package releases. Use when preparing pull requests, creating PRs, when branch has commits ready for review, or when user mentions changeset or version bump.
allowed-tools: Bash(git:*), Bash(pnpm:*), Read, Write
---

# Create Changeset Skill

## Purpose

This skill automatically analyzes branch changes and creates appropriate changesets for package releases in this monorepo. It examines git history, determines version bump types based on Conventional Commits, and generates properly formatted changeset files.

## When to Invoke

Automatically invoke this skill when:
- User is preparing to create a pull request
- User mentions "PR", "pull request", or "ready for review"
- Branch has commits ready for review
- User explicitly mentions "changeset" or "version bump"

Do NOT invoke when:
- User is only pushing changes without creating a PR
- Only documentation files have changed (README, .md files)
- Only CI/CD configuration has changed (.github/workflows/)
- Only development tool configuration has changed (eslint, prettier, etc.)
- Commits are only `docs:`, `chore:`, `ci:`, or `test:` types that don't affect packages

## Pre-execution Validation

Before creating a changeset, check if a changeset file already exists for the current changes:
- Look for `.changeset/*.md` files (excluding README.md)
- If exists, ask user: "A changeset already exists. Create another one?"

> **Repository note:** Only the `@repo/style` package currently publishes via changesets. No other workspace packages emit changeset-based releases, so focus analysis on `apps/style/` files and the surrounding tooling that affects it.

## Implementation Steps

### 1. Check Current State

- Run `git fetch --tags`, then determine the latest release tag (`git tag --list 'v*' --sort=-v:refname | head -n1`).
- Use `git log <latest-tag>..HEAD` (or `origin/main..<latest-tag>` if needed) to verify there are commits to release.
- If no tags exist, fall back to `git log main..HEAD` and explain why you're using the branch range.
- Stop if there are no commits since the latest tag.

### 2. Analyze Changes

- Diff against the latest tag (`git diff <latest-tag>..HEAD`) to inspect committed changes.
- Keep the focus on `apps/style/` and its build tooling, since `@repo/style` is the only changeset-published package.
- Summaries: use `git log <latest-tag>..HEAD --oneline` for Conventional Commit intents.
- Only mention files outside `apps/style/` if they clearly affect the generated CSS.

### 3. Determine Version Bump Type

Analyze commit messages following Conventional Commits 1.0.0 format:

- **major**: Contains `BREAKING CHANGE` in commit body, or breaking changes detected in code
  - API signature changes
  - Removed exports or features
  - Incompatible behavior changes
- **minor**: Starts with `feat:` or `feat(scope):` - new features (backward compatible)
  - New components or functionality
  - New props or options (with defaults)
  - New exports
- **patch**: Starts with `fix:` or `fix(scope):` - bug fixes and minor improvements
  - Bug fixes
  - Performance improvements
  - Minor style updates
- **skip**: Other types (`chore:`, `docs:`, `ci:`, `test:`) typically don't require changesets unless they affect package functionality

Review actual code changes to confirm the appropriate version bump. **When in doubt between minor and patch, prefer patch for safety.**

If the version bump is ambiguous or unclear:
- Ask user for clarification
- Explain the reasoning behind the suggested bump type
- Allow user to override the suggestion

If all commits are types that don't require changesets (`docs:`, `chore:`, `ci:`, `test:`), exit early without creating a changeset.

### 4. Generate Changeset

Create a changeset file with a descriptive filename in `.changeset/` directory.

**Filename format:**
- Use kebab-case with `.md` extension
- Examples: `.changeset/add-new-button.md`, `.changeset/fix-layout-bug.md`, `.changeset/update-icon-props.md`

**File content format:**
```markdown
---
"@repo/package-name": major|minor|patch
---

Clear description of the change
```

**Example for single package:**
```markdown
---
"@repo/style": minor
---

Add new Button variant for secondary actions
```

**Example for multiple packages:**
```markdown
---
"@repo/style": minor
"@repo/docs": patch
---

- style: Add new Button variant for secondary actions
- dosc: Add new docs page for contributing
```

**Important guidelines:**
- The description should be user-friendly as it will appear in CHANGELOG
- **Use the same language as the commit messages** (Japanese or English). If commit messages are mixed, prefer Japanese.
- Split changesets into separate files when the same package has changes with different purposes (e.g., new feature + bug fix, breaking change + internal refactoring)
- This creates individual top-level items in release notes, making it easier for readers to understand the intent of each change
- Example: Create `.changeset/add-secondary-button.md` for a new feature and `.changeset/fix-button-layout.md` for a bug fix, even if both target the same package

### 5. Verify and Commit

Display the generated changeset for review:
- Show the file path
- Show the file content
- Confirm it accurately reflects the changes

Once verified, commit the changeset file:
```bash
git add .changeset/<filename>.md
git commit -m "chore: add changeset"
```
