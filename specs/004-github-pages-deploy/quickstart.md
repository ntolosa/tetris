# Quickstart: GitHub Pages Deploy

This feature automatically deploys the Tetris application to GitHub Pages when code is merged or pushed to the `master` branch.

## Prerequisites
- The repository must have GitHub Actions enabled.
- The `GITHUB_TOKEN` must have `contents: write` permissions (configurable in Repository Settings -> Actions -> General -> Workflow permissions).

## How it works
1. Merge a Pull Request into the `master` branch (or push directly to it).
2. The `.github/workflows/deploy.yml` workflow will automatically trigger.
3. The workflow installs dependencies, builds the React app, and pushes the output to the `gh-pages` branch.
4. GitHub Pages will serve the app from the `gh-pages` branch.

## Finding the Deployment URL
Once the workflow completes successfully, you can view the live application:
- Navigate to the repository's **Settings > Pages** to see the configured URL.
- Or check the **Environments** section on the main repository page (often on the right sidebar).
- The exact URL is also logged at the end of the deployment workflow in the Actions tab.
