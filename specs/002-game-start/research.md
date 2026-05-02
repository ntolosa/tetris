# Research: Game Start

## Research Summary

This feature has minimal unknowns. The codebase uses React hooks (useState, useEffect, useCallback) in a single component. No external APIs, no complex state management, no backend dependencies.

## Decision 1: State Management for Game Lifecycle

**Decision**: Consolidate all game state into a single `gameStatus` variable with string enum values: `'idle'`, `'playing'`, `'paused'`, `'gameover'`.

**Rationale**: The four game states are mutually exclusive — the game cannot be simultaneously paused and ended, or idle and playing. A single variable eliminates impossible state combinations that three booleans could theoretically produce. It also simplifies all conditional logic throughout the component.

**Alternatives considered**:
- **Three separate booleans** (`isStarted`, `isPaused`, `isEndGame`): Consistent with existing code but introduces the risk of contradictory state combinations and makes conditionals harder to reason about.
- **useReducer with explicit states**: Would provide the cleanest state machine but is over-engineering for 4 simple states with straightforward transitions.

## Decision 2: Piece Generation Timing

**Decision**: Defer piece generation from module load time to when `startGame()` is called.

**Rationale**: Currently, `getRandomFicha()` is called at the module level (line 9) and in `initialFichaMetadata` (line 31). This means pieces exist before the game starts. To show a truly empty board in idle state, we need to either defer generation or use the empty matrix (`fichaMatrix`) when not started.

**Alternatives considered**:
- **Keep module-level generation, just hide visually**: Simpler but pieces would exist in state even in idle mode, which is semantically incorrect and could cause edge cases.
- **Initialize with null/empty values**: Chosen approach — initialize `fichaMetadata` with null/empty ficha, generate real pieces only on start.

## Decision 3: Game Over to Idle Transition

**Decision**: After game over, automatically reset to idle state after a brief display of the game over state.

**Rationale**: The spec requires that after game over, the start button becomes available again. The simplest approach is to reset `isStarted` to false and clear the board when game over is acknowledged.

**Alternatives considered**:
- **Separate game over screen with explicit "play again"**: More complex UI, but the spec already defines the "Iniciar" button as the mechanism for starting/restarting.
- **Automatic reset with delay**: Could show "Game Over" text briefly, then transition to idle. Simple to implement with setTimeout.

## Decision 4: Control Button Visibility

**Decision**: Conditionally render the entire controls section (movement, flip, pause) only when `isStarted` is true. Show only the "Iniciar" button when not started.

**Rationale**: The spec explicitly requires that game control buttons are hidden until the game starts. Only the start button and empty board should be visible in idle state.

**Alternatives considered**:
- **Disable buttons instead of hiding**: Spec explicitly says buttons should not be visible, not just disabled.
- **CSS visibility/opacity**: Would keep DOM elements but hide them visually. Simpler but screen readers would still see them, and it's semantically incorrect.
