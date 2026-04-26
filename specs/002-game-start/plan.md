# Implementation Plan: Game Start

**Branch**: `002-game-start` | **Date**: 2026-04-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-game-start/spec.md`

## Summary

Add an explicit game start flow to the Tetris application. Currently, the game begins automatically on load with pieces falling immediately. This feature introduces an "idle" state where the board is empty, game controls are hidden, and only an "Iniciar" button is visible. Clicking the button transitions the game to active play. After game over, the game returns to the idle state.

## Technical Context

**Language/Version**: JavaScript (ES6+) with React 18  
**Primary Dependencies**: React (hooks: useState, useEffect, useCallback), SCSS for styling  
**Storage**: N/A (client-side state only)  
**Testing**: Jest + React Testing Library (@testing-library/react)  
**Target Platform**: Web browser (Create React App)  
**Project Type**: Web application (single-page game)  
**Performance Goals**: Instant UI transitions (<100ms perceived)  
**Constraints**: No external dependencies; changes scoped to existing component  
**Scale/Scope**: Single component (`tetris.js`) + styles (`tetris.scss`) + tests (`tetris.spec.js`)

**Refactor note**: The existing three boolean states (`isEndGame`, `isPaused`, and the new `isStarted`) will be consolidated into a single `gameStatus` variable with enum-like string values. This eliminates impossible state combinations and simplifies all conditional checks.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is a placeholder template (not yet customized). No specific gates or principles are defined. Proceeding without constraints.

**Post-Design Re-check**: ✅ No violations — changes are minimal, scoped to one component, with tests.

## Project Structure

### Documentation (this feature)

```text
specs/002-game-start/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── tetris/
│       ├── tetris.js        # Main game component (MODIFY)
│       ├── tetris.scss      # Component styles (MODIFY)
│       └── tetris.spec.js   # Component tests (MODIFY)
└── constants/
    └── fichas.js            # Piece definitions (NO CHANGE)
```

**Structure Decision**: Single-component architecture. All changes are scoped to the existing `src/components/tetris/` directory. No new files or directories needed in `src/`.

## Implementation Approach

### Key Design Decisions

1. **Single `gameStatus` state**: A `useState('idle')` that replaces the existing `isEndGame` and `isPaused` booleans, and also covers the new idle state. Possible values:
   - `'idle'` — Initial load and post-game-over. Empty board, only "Iniciar" button visible.
   - `'playing'` — Active gameplay with pieces falling.
   - `'paused'` — Game frozen (from feature 001).
   - `'gameover'` — Board full, transitions back to idle.

2. **Eliminates impossible states**: With three separate booleans, combinations like `isStarted=true + isEndGame=true + isPaused=true` were technically possible. A single variable makes states mutually exclusive by design.

3. **Deferred piece generation**: Currently, pieces are generated at module load time (lines 9, 26-32). This must be deferred to when `startGame()` is called, so the board is truly empty in idle state.

4. **Control visibility**: The `controls` div (movement, flip, pause buttons) and `next` piece preview are conditionally rendered based on `gameStatus !== 'idle'`.

5. **Start button**: A new "Iniciar" button visible only when `gameStatus === 'idle'`. Clicking it sets `gameStatus = 'playing'` and initializes the first piece.

6. **Game over → idle transition**: When game over is detected, set `gameStatus = 'gameover'`, then transition to `'idle'` resetting the board.

### Files to Modify

#### `src/components/tetris/tetris.js`
- Replace `isEndGame` and `isPaused` with single `gameStatus` state (`useState('idle')`)
- Create `startGame()` callback that initializes piece metadata and sets `gameStatus = 'playing'`
- Update `togglePause` to toggle between `'playing'` and `'paused'`
- Update game over detection to set `gameStatus = 'gameover'`, then transition to `'idle'`
- Modify gravity `useEffect` to only run when `gameStatus === 'playing'`
- Modify keyboard `useEffect` to ignore game inputs when `gameStatus !== 'playing'` (except pause toggle)
- Conditionally render: controls hidden when `gameStatus === 'idle'`, "Iniciar" button shown when `gameStatus === 'idle'`
- Conditionally render: next piece preview hidden when `gameStatus === 'idle'` or `gameStatus === 'paused'`
- Render empty board matrix when `gameStatus === 'idle'`

#### `src/components/tetris/tetris.scss`
- Add styles for the start button (`.controls__start`)
- Ensure idle state visuals are clean (empty board with outline only)

#### `src/components/tetris/tetris.spec.js`
- Test: game renders in idle state on load (no pieces, start button visible)
- Test: clicking start button begins the game (pieces appear, controls visible)
- Test: game controls are not visible before start
- Test: keyboard inputs are ignored before start
- Test: game returns to idle after game over

## Complexity Tracking

> No constitution violations to justify — changes are minimal and scoped to a single component.
