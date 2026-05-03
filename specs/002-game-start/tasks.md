# Tasks: Game Start

**Input**: Design documents from `specs/002-game-start/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup needed — all changes are within the existing codebase. This phase handles the foundational state refactor.

- [x] T001 Replace `isEndGame` and `isPaused` boolean states with a single `gameStatus` state (`useState('idle')`) with values `'idle'`, `'playing'`, `'paused'`, `'gameover'` in `src/components/tetris/tetris.js`
- [x] T002 Update `togglePause` callback to toggle `gameStatus` between `'playing'` and `'paused'` (instead of toggling `isPaused` boolean) in `src/components/tetris/tetris.js`
- [x] T003 Update gravity `useEffect` to run interval only when `gameStatus === 'playing'` (replacing `isEndGame || isPaused` check) in `src/components/tetris/tetris.js`
- [x] T004 Update keyboard `useEffect` to check `gameStatus` for pause toggle (only when `gameStatus === 'playing'` or `gameStatus === 'paused'`) and block game inputs when `gameStatus !== 'playing'` in `src/components/tetris/tetris.js`
- [x] T005 Update game over detection in `changePosition` to set `gameStatus` to `'gameover'` (replacing `setIsEndGame(true)`) in `src/components/tetris/tetris.js`
- [x] T006 Update all JSX conditional rendering that references `isPaused` or `isEndGame` to use `gameStatus` comparisons in `src/components/tetris/tetris.js`
- [x] T007 Update existing pause-related button click handlers to use `gameStatus` instead of `isPaused` boolean in `src/components/tetris/tetris.js`

**Checkpoint**: The game should work exactly as before (auto-start, pause, game over) but using the new `gameStatus` variable. All existing behavior is preserved. Run `npm test` to verify existing tests pass.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Defer piece generation from module-level to game start, and add the `startGame` callback.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Move initial piece generation (`getRandomFicha()` calls at module level, lines 9 and 26-32) into a `startGame()` callback that sets `gameStatus = 'playing'` and initializes `fichaMetadata` with a fresh piece and board in `src/components/tetris/tetris.js`
- [x] T009 Initialize `fichaMetadata` with an empty board matrix and null/empty piece values (no piece on initial load) in `src/components/tetris/tetris.js`
- [x] T010 Add game over → idle transition: when `gameStatus` becomes `'gameover'`, reset `fichaMetadata` to empty initial state and set `gameStatus = 'idle'` in `src/components/tetris/tetris.js`

**Checkpoint**: Foundation ready — the game no longer auto-starts, the board is empty on load, and `startGame()` is callable. Pieces are only generated when `startGame()` is invoked.

---

## Phase 3: User Story 1 - Start the Game (Priority: P1) 🎯 MVP

**Goal**: The player can click an "Iniciar" button to start the game. Before clicking, the board is empty and no pieces fall. After clicking, the game begins normally.

**Independent Test**: Open the app → verify empty board, no pieces falling → click "Iniciar" → verify game starts with piece falling.

### Implementation for User Story 1

- [x] T011 [US1] Add "Iniciar" button to JSX, visible only when `gameStatus === 'idle'`, wired to `startGame()` callback with `data-testid="start-button"` in `src/components/tetris/tetris.js`
- [x] T012 [US1] Hide the game controls section (pause, movement, flip buttons) when `gameStatus === 'idle'` — wrap the existing `controls` div in a conditional render in `src/components/tetris/tetris.js`
- [x] T013 [US1] Hide the "Iniciar" button when `gameStatus !== 'idle'` (game is playing, paused, or gameover) in `src/components/tetris/tetris.js`
- [x] T014 [US1] Render the empty board matrix (all zeros) when `gameStatus === 'idle'` instead of `fichaMetadata.matrix` in `src/components/tetris/tetris.js`
- [x] T015 [US1] Ensure keyboard inputs (arrows, space) are ignored when `gameStatus === 'idle'` — verify the guard from T004 covers this in `src/components/tetris/tetris.js`

**Checkpoint**: At this point, User Story 1 should be fully functional. The game starts in idle state, clicking "Iniciar" starts the game, and all core gameplay works after start. Run `npm test` and manually verify.

---

## Phase 4: User Story 2 - Visual Feedback in Idle State (Priority: P2)

**Goal**: The idle state has clear visual styling — the start button is prominent, the board shows only its outline, and no game UI elements distract the player.

**Independent Test**: Open the app → visually verify clean idle state with prominent start button, empty board outline, no controls, no next piece preview.

### Implementation for User Story 2

- [x] T016 [P] [US2] Add CSS styles for the start button (`.controls__start`) with prominent styling (size, color, centered position) in `src/components/tetris/tetris.scss`
- [x] T017 [US2] Hide the next piece preview area when `gameStatus === 'idle'` (conditionally render the `.next` div) in `src/components/tetris/tetris.js`
- [x] T018 [US2] Verify the board outline/border remains visible in idle state while content is empty — test with existing `.matrix` border styles in `src/components/tetris/tetris.scss`

**Checkpoint**: Idle state is visually clean and polished. Start button is prominent and inviting.

---

## Phase 5: User Story 3 - Restart After Game Over (Priority: P2)

**Goal**: After game over, the game returns to idle state with the "Iniciar" button available, allowing the player to start a new game.

**Independent Test**: Play until game over → verify board clears and returns to idle → click "Iniciar" → verify new game starts with fresh board.

### Implementation for User Story 3

- [x] T019 [US3] Implement the game over → idle transition flow: after game over is detected, briefly show `'gameover'` state, then auto-transition to `'idle'` resetting the board matrix and piece metadata in `src/components/tetris/tetris.js`
- [x] T020 [US3] Ensure `startGame()` fully resets all game state (board matrix, piece metadata) for a fresh game after game over in `src/components/tetris/tetris.js`
- [x] T021 [US3] Verify the pause feature (001-game-pause) is disabled when `gameStatus === 'idle'` — pause toggle should only work when `gameStatus === 'playing'` or `gameStatus === 'paused'` in `src/components/tetris/tetris.js`

**Checkpoint**: Full game lifecycle works: idle → playing → (paused) → gameover → idle → playing again.

---

## Phase 6: Tests & Polish

**Purpose**: Add tests for new functionality and ensure cross-cutting concerns are covered.

- [x] T022 [P] Update existing test for pause button render — adjust to account for game needing to be started first (start game before checking pause button) in `src/components/tetris/tetris.spec.js`
- [x] T023 [P] Add test: game renders in idle state on load — verify start button is present, no game controls visible in `src/components/tetris/tetris.spec.js`
- [x] T024 [P] Add test: clicking "Iniciar" starts the game — verify start button disappears and game controls become visible in `src/components/tetris/tetris.spec.js`
- [x] T025 [P] Add test: game controls (pause, movement, flip) are not rendered before start in `src/components/tetris/tetris.spec.js`
- [x] T026 Run full test suite (`npm test`) and verify all tests pass
- [x] T027 Run quickstart.md validation — manual testing per quickstart instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup/Refactor)**: No dependencies — start immediately. Refactors state to `gameStatus`.
- **Phase 2 (Foundational)**: Depends on Phase 1 — defers piece generation, adds `startGame()`.
- **Phase 3 (US1)**: Depends on Phase 2 — adds start button and idle rendering.
- **Phase 4 (US2)**: Depends on Phase 3 — adds visual polish to idle state.
- **Phase 5 (US3)**: Depends on Phase 2 — adds game over → idle flow (can parallel with US2).
- **Phase 6 (Tests/Polish)**: Depends on Phases 3-5 completion.

### User Story Dependencies

- **US1 (P1)**: Core functionality — can start after Phase 2
- **US2 (P2)**: Visual polish — depends on US1 (needs idle state rendering to exist)
- **US3 (P2)**: Restart flow — can start after Phase 2, parallelize with US2

### Parallel Opportunities

- T016 (CSS) can run in parallel with T017 (different files)
- T022, T023, T024, T025 (tests) can all run in parallel
- US2 and US3 can be worked on in parallel after US1

---

## Parallel Example: User Story 2

```text
# These can run in parallel (different files):
Task T016: "Add CSS styles for start button in src/components/tetris/tetris.scss"
Task T017: "Hide next piece preview when idle in src/components/tetris/tetris.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Refactor state to `gameStatus`
2. Complete Phase 2: Defer piece generation, add `startGame()`
3. Complete Phase 3: User Story 1 (start button, idle rendering)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Game should start in idle state, work after clicking "Iniciar"

### Incremental Delivery

1. Phase 1 + 2 → State refactor complete, game still works but doesn't auto-start
2. Add US1 → Test independently → MVP ready!
3. Add US2 → Visual polish for idle state
4. Add US3 → Game over restart flow
5. Add tests → Full coverage

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Phase 1 is a refactor of existing code — run existing tests after to verify no regression
- The `gameStatus` refactor (Phase 1) also covers the pause feature (001-game-pause) — all pause checks switch from `isPaused` boolean to `gameStatus === 'paused'`
- Commit after each phase for clean git history
