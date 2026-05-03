# Data Model: GitHub Pages Deploy

No application database entities are created for this feature. The entities involved are infrastructure configurations.

## Entities

### GitHub Actions Workflow (`deploy.yml`)
- **Trigger**: `push` (target: `master`)
- **Jobs**: 
  - `build_and_deploy`
- **Steps**:
  - Checkout code
  - Setup Node.js
  - Install dependencies (`npm ci`)
  - Build application (`npm run build`)
  - Deploy to GitHub Pages (using `peaceiris/actions-gh-pages@v3`)

### GitHub Pages Environment
- **Branch**: `gh-pages`
- **Source**: The `build/` output directory of the React app.
