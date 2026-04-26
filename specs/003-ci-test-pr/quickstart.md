# Quickstart: CI Test on PR

## Overview

This feature adds a GitHub Actions workflow that automatically runs the project's test suite whenever a pull request is created or updated against the `develop` or `main` branches.

## What Changes

### For Developers
- Test results appear automatically as a status check on every PR to develop/main
- Failed tests are visible directly on the PR page with accessible logs
- No manual test running needed before merge — CI catches regressions

### For the Project

**New file**:
- `.github/workflows/test-on-pr.yml` — GitHub Actions workflow configuration

**No existing files are modified.**

## How to Test

### Automatic Verification

The workflow validates itself — once merged, any subsequent PR to `develop` or `main` will trigger the CI pipeline.

### Manual Verification

1. Push the branch and create a PR against `develop`
2. Navigate to the PR page on GitHub
3. Verify the "Tests" workflow appears in the status checks section
4. Verify the workflow completes and shows pass/fail
5. If tests fail, click on "Details" to verify test output logs are accessible

### Edge Case Verification

1. Create a PR targeting a branch other than `develop` or `main` (e.g., a feature branch) → verify the workflow does NOT trigger
2. Push additional commits to an open PR → verify the workflow re-triggers

## Dependencies

- GitHub repository with Actions enabled (already the case)
- No new external dependencies or packages
