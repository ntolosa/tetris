# Tasks: CI Test on PR

**Input**: Design documents from `specs/003-ci-test-pr/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Create the GitHub Actions directory structure.

- [x] T001 Create the `.github/workflows/` directory structure at the repository root

**Checkpoint**: Directory exists and is ready for workflow file.

---

## Phase 2: User Story 1 & 2 - Automatic Test Execution on PR (Priority: P1) 🎯 MVP

**Goal**: The CI pipeline triggers automatically on PR creation and updates targeting `develop` and `main`, executes the test suite, and reports results.

**Independent Test**: Create a PR against `develop` → verify the "Tests" workflow triggers → verify it runs `npm test` → verify pass/fail status appears on the PR.

### Implementation

- [x] T002 [US1] Create the GitHub Actions workflow file at `.github/workflows/test-on-pr.yml` with workflow name "Tests", trigger on `pull_request` event targeting branches `[develop, main]`
- [x] T003 [US1] Add job `test` running on `ubuntu-latest` with a 10-minute timeout in `.github/workflows/test-on-pr.yml`
- [x] T004 [US1] Add step to checkout repository code using `actions/checkout@v4` in `.github/workflows/test-on-pr.yml`
- [x] T005 [US1] Add step to set up Node.js 18 using `actions/setup-node@v4` with npm caching enabled in `.github/workflows/test-on-pr.yml`
- [x] T006 [US1] Add step to install dependencies using `npm ci` in `.github/workflows/test-on-pr.yml`
- [x] T007 [US1] Add step to run the test suite using `npm test` with `CI=true` environment variable in `.github/workflows/test-on-pr.yml`

**Checkpoint**: Workflow file is complete. Push and create a PR against `develop` to verify that the CI pipeline triggers, installs dependencies, runs tests, and reports results as a status check.

---

## Phase 3: User Story 3 - CI Results Visibility (Priority: P2)

**Goal**: Test results and logs are accessible from the PR page for debugging.

**Independent Test**: Trigger a CI run (by creating or updating a PR) → verify status check appears → click details → verify test logs are accessible.

### Implementation

- [x] T008 [US3] Verify that GitHub Actions natively displays the status check on the PR page — no additional configuration needed in `.github/workflows/test-on-pr.yml`
- [x] T009 [US3] Verify that test output logs are accessible by clicking "Details" on the status check — confirm the `npm test` step output is visible in the Actions run log

**Checkpoint**: CI results are visible on PR page, and logs are accessible for debugging.

---

## Phase 4: Polish & Validation

**Purpose**: End-to-end verification and edge case validation.

- [x] T010 Push the branch and create a PR against `develop` to trigger the CI pipeline
- [x] T011 Verify the workflow triggers automatically and completes with pass/fail status
- [x] T012 Verify the workflow does NOT trigger for PRs targeting branches other than `develop` and `main`
- [x] T013 Run quickstart.md validation — follow all verification steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (US1 & US2)**: Depends on Phase 1 — creates the workflow file
- **Phase 3 (US3)**: Depends on Phase 2 — requires a working CI pipeline to verify visibility
- **Phase 4 (Polish)**: Depends on Phase 2 & 3 — requires complete workflow for end-to-end validation

### User Story Dependencies

- **US1 & US2 (P1)**: Core pipeline — independent, no prerequisites
- **US3 (P2)**: Visibility — requires US1/US2 working pipeline to verify

### Parallel Opportunities

- T002-T007 are sequential since they all modify the same file
- T008 and T009 (US3) are verification tasks — can run after pipeline is deployed
- T010-T013 are sequential validation steps

---

## Implementation Strategy

### MVP First (User Story 1 & 2 Only)

1. Complete Phase 1: Create directory
2. Complete Phase 2: Create workflow file with all steps
3. **STOP and VALIDATE**: Push, create PR, verify CI triggers
4. This is the core deliverable — a working CI pipeline

### Incremental Delivery

1. Create workflow file → Push → Verify CI runs (MVP!)
2. Verify visibility and logs (US3)
3. Validate edge cases (Polish)

---

## Notes

- All implementation tasks (T002-T007) modify the same file — they should be executed as a single cohesive workflow file creation
- US3 tasks (T008-T009) are verification-only — GitHub Actions provides status checks and log visibility out of the box
- The `CI=true` environment variable ensures Create React App's test runner exits after running (non-interactive mode)
