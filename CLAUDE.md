# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

OpenAPI 3.0 specification for the Smartling REST API, published at https://api-reference.smartling.com/. The spec is split across multiple YAML files under `spec/` and bundled at build time into a single `swagger.json`/`swagger.yaml` for rendering via ReDoc/Swagger UI.

## Commands

```bash
npm install          # install dependencies (Node 26 LTS, same as the Jenkins image node:26-trixie; see .nvmrc)
npm start            # build, start local server + swagger-editor (live reload)
npm test             # validate the OpenAPI spec (swagger-repo validate)
npm run build        # bundle spec into web_deploy/ (swagger-repo, then redocly via scripts/bundle-refs.js)
npm run lint:spec    # redocly lint of web_deploy/swagger.json (run after npm run build)
npm run process-yaml # re-generate TQC x-paths (required after editing TQC YAML files)
```

The local server URL is printed to console on startup. The swagger-editor URL is also printed separately (port 5000+).

## Spec structure

- `spec/openapi.yaml` - root file: server, global tags (with long descriptions), and `$ref` paths to all sub-specs
- `spec/api_common.yaml` - shared reusable components: parameters (`accountUid`, `projectId`, `projectUid`, `localeId`, `offset`, `limit`), request bodies, reusable error responses (`Error400ResponseDefinition`, `Error401ResponseDefinition`, `Error429ResponseDefinition`, `Error500ResponseDefinition`), and common schemas (ID and UID types such as `LocaleId`, `ProjectUid`, `UserUid`, `TranslationJobUid`; `Hashcode`, `FileUri`, `FileType`, `DateTime`; `SuccessResponse`, `EmptyResponse` and the `Error*Response` envelopes)
- Each API domain lives in its own subdirectory:
  - `spec/translation_quality/` - TQC endpoints split across many files; uses `x-paths` extension and requires `npm run process-yaml` after edits
  - `spec/issues/` - Issues, issue comments, watchers, dictionaries, sub-types
  - `spec/job_batches_v1/` and `spec/job_batches_v2/` - Job batch endpoints
  - `spec/glossary_v3/` - Glossary, blocklist, import/export, labels, entries
  - `spec/webhooks_api/` - Webhook subscriptions, events, components
  - `spec/file_translation/` - File MT upload, MT, language detection
  - `spec/strings/` - Strings API v2 (uses `x-paths` extension)
  - `spec/connectors_import_v3/` - Connectors Import API
  - `spec/tmm/` - Translation Memory (TMX import/download) endpoints; uses `x-paths` extension

## Key conventions

**Global headers**: The `headers:` top-level key (non-standard) is supported - references like `$ref: "#/headers/Rate-Limit-Limit"` are inlined and the `headers` block is removed during build so the output remains valid OpenAPI.

**x-paths extension**: `spec/translation_quality/`, `spec/strings/`, and `spec/tmm/` use a custom `x-paths` key (not the standard `paths`) with `$ref` includes. Running `npm run process-yaml` resolves these refs and merges them into `spec/openapi.yaml`. Always run this after editing TQC or Strings YAML files (`spec/tmm/` does not need this step - see `spec/process-yaml.js`, which only lists `translation_quality/*.yaml`).

**Build output**: `npm run build` produces `web_deploy/` containing the bundled spec (`swagger.json`, `swagger.yaml`), the static web UI, and copies of all spec subdirectories.

**Adding a new domain as a standalone spec file/folder**: after `swagger-repo bundle`, `scripts/bundle-refs.js` runs `redocly bundle` on `swagger.json` and `swagger.yaml` and inlines every path-item `$ref` (the pattern every domain subdirectory uses, standard `paths` or the custom `x-paths` extension alike), so the published spec is self-contained. Redocly resolves the refs against the copied `spec/` folders in the output directory, so every new domain subdirectory must be added to the hardcoded `spec/` copy list in **both**:
- `scripts/build.js` (used by `npm run build`, the main site)
- `scripts/deploy-branch.js` (used by Jenkins for branch/PR previews, `npm run deploy-branch`)

A missing copy-list entry now fails the build (`Can't resolve $ref`) instead of silently rendering a tag with zero operations. Sub-files must reference shared components through `../api_common.yaml#/components/...`. A root-relative `#/components/...` ref in a sub-file fails the bundle. `npm run lint:spec` lints the bundled `web_deploy/swagger.json` with Redocly (config in `redocly.yaml`).

## Schema reuse and strict typing

- Reuse the `api_common.yaml` schemas and parameters for IDs, UIDs, locales, hashcodes, file URIs, file types, dates and error envelopes instead of declaring inline `type: string` copies.
- Match by property meaning, not only by shape: `sourceLocaleId` and `targetLocaleId` use `LocaleId`, `projectId` uses `ProjectUid`, `*UserUid` uses `UserUid`, `*WorkflowStepUid` uses `WorkflowStepUid`, date-time strings use `DateTime`.
- Keep a property's `description` when it adds meaning beyond the shared schema (role, owning entity, relationship), using `allOf` with the `$ref` plus a sibling `description`. Drop it only when it restates the type, for example "Locale id.".
- Give array `items` a `$ref` or a fully typed schema. Never leave `items` empty or use bare `type: string` when a shared schema fits (for example `localeIds` items are `LocaleId`).
- Add `minItems`, `maxItems` and `uniqueItems` only when the API enforces the limit and the description or code says so. Do not invent limits.
- Check `api_common.yaml` before declaring a new inline schema. Keep an inline definition only when the shared constraint conflicts with real values, and nullable fields stay inline because `allOf` with a `$ref` cannot express `null` in OAS 3.0.
- Sub-files reference shared components as `../api_common.yaml#/components/...` (adjust the relative path to the file depth). `spec/openapi.yaml` uses `./spec/api_common.yaml#/...` for schemas, but keeps shared parameters and responses inline because `npm test` cannot resolve an external `$ref` in those positions.

## CI/CD

- Jenkins builds on every branch; non-master branches deploy a preview - the URL depends on whether a PR is open:
  - No PR open: `https://api-reference.smartling.com/preview/<branch-name-lowercase>`
  - PR open: `https://api-reference.smartling.com/preview/pr-<number>` (Jenkins uses the PR ref as `BRANCH_NAME`)
- `master` deploys to the main documentation site
- Preview branches are not auto-cleaned; stale previews must be cleaned manually via the `gh-pages` branch (see README.md)
