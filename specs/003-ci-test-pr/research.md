# Research: CI Test on PR

## Research Summary

This feature is straightforward with minimal unknowns. GitHub Actions is the CI platform, the project uses Node.js with npm, and the workflow syntax is well-documented.

## Decision 1: Workflow Trigger Configuration

**Decision**: Use `pull_request` event with `branches: [develop, main]`.

**Rationale**: The `pull_request` event includes activity types `opened`, `synchronize`, and `reopened` by default. This covers all spec requirements: triggering on PR creation (opened), on new commits pushed (synchronize), and on PR reopened. No need to specify activity types explicitly.

**Alternatives considered**:
- **`pull_request_target`**: Runs in the context of the base branch. Useful for workflows that need write access to the repo, but unnecessary for running tests. Also has security implications with forked PRs.
- **`push` event on PR branches**: Would trigger on every push, not just PR-related ones. More noisy and doesn't provide PR status checks.

## Decision 2: Runner OS

**Decision**: Use `ubuntu-latest`.

**Rationale**: The fastest and most cost-effective GitHub-hosted runner. The Tetris project is a standard React app with no OS-specific dependencies. No need for macOS or Windows runners.

**Alternatives considered**:
- **`macos-latest`**: More expensive and slower. Only needed for iOS builds or macOS-specific testing.
- **`windows-latest`**: Not needed for a web application.
- **Matrix strategy (multiple OS)**: Over-engineering for a single-platform web app.

## Decision 3: Dependency Installation

**Decision**: Use `npm ci` instead of `npm install`.

**Rationale**: `npm ci` is designed for CI environments — it installs directly from `package-lock.json`, is faster, and ensures reproducible builds. It also removes `node_modules` before installing, avoiding stale dependency issues.

**Alternatives considered**:
- **`npm install`**: Slower, may update `package-lock.json`, less deterministic.
- **`yarn install --frozen-lockfile`**: Project uses npm, not yarn.

## Decision 4: Node.js Version Strategy

**Decision**: Use Node 18 (LTS) with `actions/setup-node@v4` and enable npm caching.

**Rationale**: Node 18 is the current LTS version and matches the project's NVM configuration. The `actions/setup-node` action provides built-in caching support for npm, reducing install times on repeated runs.

**Alternatives considered**:
- **Read from `.nvmrc`**: More dynamic but adds complexity. The project may or may not have an `.nvmrc` file.
- **Node 20**: Newer but the project was built with Node 18 tooling.
- **Node matrix (multiple versions)**: Over-engineering for a single-version project.

## Decision 5: Test Command

**Decision**: Use `npm test -- --watchAll=false`.

**Rationale**: Create React App's default test runner (react-scripts test) runs in watch mode by default. In CI, we need non-interactive mode. The `--watchAll=false` flag ensures tests run once and exit. The `CI=true` environment variable also achieves this, and we'll set both for reliability.

**Alternatives considered**:
- **`CI=true npm test`**: Setting the CI environment variable alone. Works but being explicit with `--watchAll=false` is more reliable across different CRA versions.
- **Custom test script**: Unnecessary — the default test command works fine.
