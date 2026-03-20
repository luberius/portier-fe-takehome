# Portier Frontend Take-Home

A React + TypeScript + Vite implementation of an integration sync panel for reviewing sync status, browsing sync history, and approving live sync previews from the provided API.

## What Is Implemented

- Integrations list with status, last synced time, and version
- Integration detail page with mocked local-state summary and recent history
- History page with versioned sync entries
- Read-only diff page for inspecting historical changes
- Live `Sync now` flow backed by the provided API
- Selectable sync approval UI
- Local persistence of approved sync snapshots as history records in `localStorage`

## Data Model & Persistence

The app uses two data sources:
- **Mock data** for the integration list, detail views, and initial history.
- **Live API data** for the "Sync now" preview and approval flow.

**What is saved**:
When you approve a sync, the results are saved in `localStorage`. This includes the history of those changes and updated metadata like the new version number and last sync time.

**What is not saved**:
The app doesn't try to rebuild the full state of every user, door, or key from the sync preview. It only tracks the specific changes that were approved.

## Assumptions

- **Record Types**: Integrations are built around three types of records: users, doors, and keys.
- **API Surface**: The take-home brief provides a single sync endpoint and no separate confirmation or conflict-resolution API contract. In local testing, the endpoint behaved as a `GET` request that returns a sync preview payload. Because of that, the app treats the API as a preview source only, and models approval/conflict resolution locally in the frontend.
- **Sync Previews**: The sync API provides a list of proposed changes (a "diff") to review, rather than sending the entire database state. Because of this, the app is built as a review tool for approving specific updates. We don't try to reconstruct or mirror the full state of every record in the system; we just focus on tracking the history of the changes that were actually approved.
- **Grouping Changes**: 
    - Early on, we expected the API to return changes that were easy to link to specific records. However, we observed that the API can return multiple changes for the same field (like two different `user.phone` updates) without a unique ID to tie them together.
    - Because of this ambiguity, the app relies on **sequential grouping**. If field changes for the same entity (like `user.email` and `user.role`) appear one after another in the API response, we group them into a single card.
    - We also use `id` fields (like `user.id`) as markers to start a new group for added or deleted records. 
    - If a field change appears out of sequence or doesn't have a clear parent, it's shown as its own individual item to keep the review accurate.

## Design Decisions

- **Shared history domain helpers**: Cross-page history logic lives in shared helpers so the detail page, history page, diff page, and conflict resolver all work from the same merged and date-sorted history model.
- **Local persistence for approvals**: Because the provided API does not expose a confirmation/write contract, approved syncs and resolved conflicts are persisted in `localStorage`. This keeps the review flow stateful without inventing unsupported backend behavior.
- **Preview-first review model**: The app treats the API response as a proposed set of changes to inspect before applying. Approval and conflict resolution are presented as auditable history events instead of mutating a fully reconstructed external data model.

## User Journey Notes

- **Confirmation for critical decisions**: The UI adds confirmation dialogs before applying a sync or merging resolved conflicts, because both actions create new history events.
- **Warning before syncing over unresolved conflicts**: If an integration still has an active conflict state, the UI warns the user before starting a new sync. This creates an explicit choice between resolving the existing conflict first or continuing into a fresh sync preview that may replace the current review context.

## Error Handling

- **4xx responses**: Shown as a configuration/request problem and surfaced inline on the sync page so the user can retry without losing navigation context.
- **500 responses**: Shown as an internal server failure with a clear retry path.
- **502 responses**: Treated as an upstream integration outage and communicated as a temporary external system issue.
- **Unknown failures**: Fallback messaging is shown when the error does not match a known status code.
- **Loading and empty states**: Pages use loading skeletons while data is being fetched and display page-level recovery UI when required data cannot be loaded.

## Local Development

Requirements:

- Node.js 20+ or Bun 1+

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The Vite app will be available at the local URL shown in the terminal, typically `http://localhost:5173`.

Useful commands:

```bash
npm run typecheck
npm run build
```

## Run With Docker

Build the image:

```bash
docker build -t portier-fe .
```

Run the container:

```bash
docker run --rm -p 8080:80 portier-fe
```

Then open:

```text
http://localhost:8080
```

The Docker image uses:

- `oven/bun` to install dependencies and build the app
- `nginx:alpine` to serve the static production bundle
