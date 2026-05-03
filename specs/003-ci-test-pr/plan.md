# Implementation Plan: CI Test on PR

**Branch**: `003-ci-test-pr` | **Date**: 2026-04-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-ci-test-pr/spec.md`

## Summary

Add a GitHub Actions workflow that automatically runs the project's test suite on every pull request targeting the `develop` or `main` branches. The workflow will install dependencies, execute tests, and report results as a status check on the PR page.

## Technical Context

**Language/Version**: YAML (GitHub Actions workflow syntax)  
**Primary Dependencies**: GitHub Actions platform, Node.js runtime (for npm test)  
**Storage**: N/A  
**Testing**: Self-testing — the workflow verifies itself by running the project's test suite  
**Target Platform**: GitHub Actions runners (ubuntu-latest)  
**Project Type**: CI/CD configuration  
**Performance Goals**: CI run completes within 5 minutes for typical test suite  
**Constraints**: GitHub-hosted runners; no self-hosted infrastructure needed  
**Scale/Scope**: Single workflow YAML file added to `.github/workflows/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is a placeholder template (not yet customized). No specific gates or principles are defined. Proceeding without constraints.

**Post-Design Re-check**: ✅ No violations — a single YAML file addition with no impact on application code.

## Project Structure

### Documentation (this feature)

```text
specs/003-ci-test-pr/
├── plan.md              # This file
├── research.md          # Phase 0 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── test-on-pr.yml   # NEW — GitHub Actions workflow file
```

**Structure Decision**: GitHub Actions requires workflow files in `.github/workflows/`. Only one new file is needed. No changes to existing source code.

## Implementation Approach

### Key Design Decisions

1. **Workflow trigger**: Use `pull_request` event targeting `branches: [develop, main]`. This covers PR creation and subsequent pushes (via the `synchronize` activity type which is included by default).

2. **Runner environment**: Use `ubuntu-latest` — the most common and fastest GitHub-hosted runner. No special OS requirements for running JS tests.

3. **Node.js version**: Use the same Node.js version as the project. The project uses NVM, so we'll check `.nvmrc` if present, or use a sensible default (Node 18 LTS).

4. **Steps**:
   - Checkout the repository code
   - Set up Node.js with the correct version
   - Install dependencies (`npm ci` for CI-optimized install)
   - Run the test suite (`npm test`)

5. **Timeout**: Set a 10-minute job timeout as a safety measure per the spec assumptions.

6. **Caching**: Cache `node_modules` via the actions/setup-node built-in caching to speed up subsequent runs.

### Files to Create

#### `.github/workflows/test-on-pr.yml` [NEW]
- Workflow name: "Tests"
- Trigger: `pull_request` targeting `develop` and `main` branches
- Job: single `test` job running on `ubuntu-latest`
- Steps: checkout → setup-node → npm ci → npm test
- Timeout: 10 minutes

## Complexity Tracking

> Minimal complexity — single YAML file, no application code changes, no dependencies on existing features.
