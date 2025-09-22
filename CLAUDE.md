# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Mintlify-based documentation website for TGPC (The Grow Process Company) that serves as an internal information hub. The site contains SOPs, product documentation, and integration guides.

## Commands

### Local Development
```bash
# Install Mintlify CLI globally (one-time setup)
npm i -g mintlify

# Run local development server
cd docs
mintlify dev
```

### Troubleshooting
- If `mintlify dev` isn't running: Run `mintlify install` to re-install dependencies
- If page loads as 404: Ensure you're running the command in the directory containing `docs.json`

## Architecture & Structure

### Configuration
- **docs/docs.json** - Main Mintlify configuration file that defines:
  - Site metadata and theme
  - Navigation structure with 4 main tabs
  - Logo paths for light/dark modes

### Content Organization
All content lives in the `/docs` directory:
- **product-links/** - Product documentation pages (academy packages, mentoring blocks, BCN retreat)
- **sops/** - Standard Operating Procedures for team processes and client management
- **calendly-links/** - Calendly integration documentation
- **api-reference/** - API documentation with OpenAPI spec
- **images/** and **logo/** - Visual assets

### Navigation Tabs
1. **Product Links** - Product offerings and packages
2. **SOPs** - Team processes and client management procedures
3. **Calendly Links** - Scheduling integration
4. **Tech Stack** - Technology overview

## Development Workflow
1. All documentation files use MDX format (Markdown with JSX support)
2. Changes are automatically deployed via Mintlify's GitHub integration when pushed to the default branch
3. Navigation structure is controlled through `docs/docs.json`
4. New pages must be added to the navigation array in `docs.json` to appear in the site