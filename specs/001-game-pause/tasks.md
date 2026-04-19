# Tasks: Game Pause

**Input**: Design documents from `specs/001-game-pause/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not explicitly requested in the spec. Included as minimal smoke tests since the project already has a test file (`tetris.spec.js`).

**Organization**: Tasks grouped by user story. US1 and US2 are both P1 and tightly coupled (pause/resume is a single toggle), so they share a phase. US3 (visual feedback) is a separate phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup needed — the project is fully initialized. This phase adds the foundational state that all user stories depend on.

- [ ] T001 Add `isPaused` state variable (`useState(false)`) to the Tetris component in `src/components/tetris/tetris.js`
- [ ] T002 Add `togglePause` callback (`useCallback`) that toggles `isPaused` only when `isEndGame` is false in `src/components/tetris/tetris.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Wire up the pause toggle triggers (keyboard and button) that all user stories depend on.

**⚠️ CRITICAL**: US1/US2/US3 all need the toggle mechanism in place first.

- [ ] T003 Add keyboard listener for "P", "p", and "Escape" keys to call `togglePause()` in the existing `handleKeyDown` function in `src/components/tetris/tetris.js`. The pause keys must be handled before the `isPaused` guard so they always work.
- [ ] T004 Add a pause/resume button (`<button>`) to the controls section in the JSX of `src/components/tetris/tetris.js`. Place it inside a new `<div className='controls__pause'>` above `controls__movement`. The button calls `togglePause` on click and is disabled when `isEndGame` is true.

**Checkpoint**: At this point, pressing "P"/"Escape" or clicking the button toggles `isPaused` state (verifiable via React DevTools).

---

## Phase 3: User Story 1 & 2 — Pause and Resume the Game (Priority: P1) 🎯 MVP

**Goal**: When paused, pieces stop falling and all movement input is blocked. When resumed, the game continues from the exact pre-pause state.

**Independent Test**: Start the game, press "P" → pieces stop falling, arrow keys do nothing. Press "P" again → pieces resume falling and controls work.

### Implementation for User Story 1 & 2

- [ ] T005 [US1] Gate the gravity `setInterval` on `isPaused`: modify the timer `useEffect` to include `isPaused` in its dependency array and add `isPaused` to the early-return guard alongside `isEndGame` in `src/components/tetris/tetris.js`
- [ ] T006 [US1] Block keyboard movement input when paused: add an `if (isPaused) return;` guard after the pause key handler in `handleKeyDown` so ArrowLeft, ArrowRight, ArrowDown, and Space are ignored in `src/components/tetris/tetris.js`
- [ ] T007 [US2] Guard on-screen button handlers when paused: wrap `onClick` handlers for Left, Right, Down, and Flip buttons with `!isPaused &&` checks in `src/components/tetris/tetris.js`

**Checkpoint**: Pause/resume fully works — gravity stops/starts, all input is blocked/unblocked. This is the MVP.

---

## Phase 4: User Story 3 — Visual Feedback During Pause (Priority: P2)

**Goal**: When paused, the board shows only its outline (no blocks visible), a "Pausado" overlay appears centered, the next piece preview is hidden, and the button label reflects the current state.

**Independent Test**: Pause the game → board is empty but outline visible, "Pausado" text centered on board, next piece hidden, button says "Reanudar". Resume → everything restored, button says "Pausa".

### Implementation for User Story 3

- [ ] T008 [P] [US3] Add pause overlay and button styles to `src/components/tetris/tetris.scss`: add `.pause-overlay` class (position absolute, inset 0, flexbox centering, semi-transparent background, white bold text, z-index 10) and `.controls__pause` class (width 100%, text-align center, margin-bottom 10px). Add `position: relative` to the `.matrix` class.
- [ ] T009 [US3] Render empty board when paused: modify the matrix JSX in `src/components/tetris/tetris.js` to render `fichaMatrix` (all zeros) instead of `fichaMetadata.matrix` when `isPaused` is true, preserving the grid outline while hiding all blocks
- [ ] T010 [US3] Add "Pausado" overlay: add a conditional `<div className='pause-overlay'>Pausado</div>` inside the `.matrix` container that renders only when `isPaused` is true in `src/components/tetris/tetris.js`
- [ ] T011 [US3] Hide next piece preview when paused: wrap the `renderMatrix(fichaMetadata.nextFicha)` call with `!isPaused &&` condition in the `.next` div in `src/components/tetris/tetris.js`
- [ ] T012 [US3] Set dynamic button label: change the pause button text to display "Reanudar" when `isPaused` is true and "Pausa" when false in `src/components/tetris/tetris.js`

**Checkpoint**: All visual feedback is complete — board hides content, overlay shows, next piece hidden, button label toggles.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Tests and edge case handling across all user stories.

- [ ] T013 [P] Add test: pause button renders with "Pausa" label in `src/components/tetris/tetris.spec.js`
- [ ] T014 [P] Add test: clicking pause button shows "Pausado" overlay and changes button label to "Reanudar" in `src/components/tetris/tetris.spec.js`
- [ ] T015 Verify edge case: pressing pause when `isEndGame` is true does nothing — confirm `togglePause` guard works correctly in `src/components/tetris/tetris.js`
- [ ] T016 Run full test suite (`npm test`) and verify all tests pass
- [ ] T017 Run quickstart validation: start app (`npm start`), manually test pause/resume via keyboard and button per `specs/001-game-pause/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001, T002)
- **US1 & US2 (Phase 3)**: Depends on Phase 2 (T003, T004)
- **US3 (Phase 4)**: Depends on Phase 3 (needs pause state to be functional)
- **Polish (Phase 5)**: Depends on Phase 4 (all features complete)

### User Story Dependencies

- **US1 & US2 (P1)**: Combined because pause/resume is a single toggle — can start after Foundational (Phase 2)
- **US3 (P2)**: Can technically start after Phase 2, but logically depends on US1/US2 being functional to test visual feedback

### Within Each Phase

- T001 → T002 (togglePause depends on isPaused and isEndGame state)
- T003 and T004 can run in parallel (keyboard vs button are independent trigger mechanisms)
- T005 and T006 can run in parallel (timer vs input blocking are independent concerns)
- T008 can run in parallel with T009-T012 (SCSS vs JS are different files)
- T013 and T014 can run in parallel (independent test cases)

### Parallel Opportunities

```
Phase 2: T003 ─┐
                ├── Phase 3 begins
        T004 ─┘

Phase 3: T005 ─┐
                ├── Phase 4 begins
        T006 ─┘
        T007 ─┘

Phase 4: T008 (scss) ─┐
         T009 (js)  ───┤ T009→T010→T011→T012 are sequential (same file)
                       │
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T004)
3. Complete Phase 3: US1 & US2 (T005-T007)
4. **STOP and VALIDATE**: Game pauses and resumes correctly via keyboard and button
5. This is a fully functional pause feature (just without the visual polish)

### Incremental Delivery

1. Setup + Foundational → Toggle mechanism ready
2. Add US1 & US2 → Functional pause/resume → MVP ✅
3. Add US3 → Visual feedback (board hiding, overlay, button label) → Full feature ✅
4. Polish → Tests + edge cases → Production ready ✅

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 are combined into a single phase because they are two sides of the same toggle mechanism
- Total: 17 tasks across 5 phases
- All changes are in 3 existing files — no new files created in `src/`
- Commit after each phase checkpoint for clean git history
