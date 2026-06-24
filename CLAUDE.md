# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

OpenAPI 3.0 specification for the Smartling REST API, published at https://api-reference.smartling.com/. The spec is split across multiple YAML files under `spec/` and bundled at build time into a single `swagger.json`/`swagger.yaml` for rendering via ReDoc/Swagger UI.

## Commands

```bash
npm install          # install dependencies (Node 17+ required)
npm start            # build, start local server + swagger-editor (live reload)
npm test             # validate the OpenAPI spec (swagger-repo validate)
npm run build        # bundle spec into web_deploy/
npm run process-yaml # re-generate TQC x-paths (required after editing TQC YAML files)
```

The local server URL is printed to console on startup. The swagger-editor URL is also printed separately (port 5000+).

## Spec structure

- `spec/openapi.yaml` - root file: server, global tags (with long descriptions), and `$ref` paths to all sub-specs
- `spec/api_common.yaml` - shared reusable components: parameters (`accountUid`, `projectId`, `localeId`), request bodies, and common schemas (`SuccessResponse`, `EmptyResponse`, etc.)
- Each API domain lives in its own subdirectory:
  - `spec/translation_quality/` - TQC endpoints split across many files; uses `x-paths` extension and requires `npm run process-yaml` after edits
  - `spec/issues/` - Issues, issue comments, watchers, dictionaries, sub-types
  - `spec/job_batches_v1/` and `spec/job_batches_v2/` - Job batch endpoints
  - `spec/glossary_v3/` - Glossary, blocklist, import/export, labels, entries
  - `spec/webhooks_api/` - Webhook subscriptions, events, components
  - `spec/file_translation/` - File MT upload, MT, language detection
  - `spec/strings/` - Strings API v2 (uses `x-paths` extension)
  - `spec/connectors_import_v3/` - Connectors Import API

## Key conventions

**Global headers**: The `headers:` top-level key (non-standard) is supported - references like `$ref: "#/headers/Rate-Limit-Limit"` are inlined and the `headers` block is removed during build so the output remains valid OpenAPI.

**x-paths extension**: `spec/translation_quality/` and `spec/strings/` use a custom `x-paths` key (not the standard `paths`) with `$ref` includes. Running `npm run process-yaml` resolves these refs and merges them into `spec/openapi.yaml`. Always run this after editing TQC or Strings YAML files.

**Build output**: `npm run build` produces `web_deploy/` containing the bundled spec (`swagger.json`, `swagger.yaml`), the static web UI, and copies of all spec subdirectories.

## CI/CD

- Jenkins builds on every branch; non-master branches deploy a preview - the URL depends on whether a PR is open:
  - No PR open: `https://api-reference.smartling.com/preview/<branch-name-lowercase>`
  - PR open: `https://api-reference.smartling.com/preview/pr-<number>` (Jenkins uses the PR ref as `BRANCH_NAME`)
- `master` deploys to the main documentation site
- Preview branches are not auto-cleaned; stale previews must be cleaned manually via the `gh-pages` branch (see README.md)
