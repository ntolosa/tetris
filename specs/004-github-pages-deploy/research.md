# Research: GitHub Pages Deploy

## Feature Context
Automate the deployment of a React application to GitHub Pages whenever a Pull Request is merged into `master` or code is pushed directly to `master`.

## Unknowns & Technical Decisions

### 1. GitHub Actions Deployment Method
- **Decision**: Use the `peaceiris/actions-gh-pages@v3` action to deploy the built artifact to the `gh-pages` branch.
- **Rationale**: The project appears to be a React application. `actions-gh-pages` is extremely robust for deploying static sites to the `gh-pages` branch. We will build the app via `npm run build` and then deploy the `build/` directory.
- **Alternatives considered**: 
  - Official GitHub Pages Actions (`actions/upload-pages-artifact` + `actions/deploy-pages`): Modern approach, but requires specific settings in the repository (GitHub Pages Source: GitHub Actions) which might not be set by default. `peaceiris/actions-gh-pages@v3` works with the default `gh-pages` branch source.
  - `gh-pages` npm script: Requires configuring `package.json` with a `homepage` field and adding a script, then running it in the CI. Using the Action is cleaner and keeps deployment logic in the workflow file.

### 2. Required GitHub Token Permissions
- **Decision**: The workflow must have `contents: write` permissions.
- **Rationale**: To push the built site to the `gh-pages` branch, the `GITHUB_TOKEN` needs write access to the repository contents.
- **Alternatives considered**: Using a Personal Access Token (PAT), but `GITHUB_TOKEN` is preferred for security and simplicity.

### 3. URL Logging (FR-004)
- **Decision**: The deployment URL will be logged in the GitHub Actions output and visible in the GitHub Environment deployments UI.
- **Rationale**: This meets FR-004 without requiring a bot to comment on the PR, avoiding the need for `pull-requests: write` permissions.

## Conclusion
All technical questions are resolved. The plan is straightforward: create a `.github/workflows/deploy.yml` that triggers on `push` to `master` (which covers both direct pushes and merged pull requests). No `pull_request` triggers are needed.
