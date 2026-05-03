# Research: Game Pause

## R1: Game State Management Pattern

**Decision**: Extend the existing `useState` pattern with a new `isPaused` boolean state variable in the `Tetris` component, following the same pattern as the existing `isEndGame` state.

**Rationale**: The project already uses a simple `useState` pattern for game state (`isEndGame`). Adding `isPaused` is consistent with the existing architecture and avoids introducing unnecessary complexity (e.g., a state machine or reducer). The component is small enough (~266 lines) that a boolean flag is appropriate.

**Alternatives considered**:
- **useReducer with state machine**: Would provide more formal state management (idle → playing → paused → gameOver), but is overkill for adding a single toggle. The existing codebase uses `useState` exclusively.
- **Context-based global state**: Not needed — the entire game lives in a single component. There are no child components that need access to pause state.

## R2: Pause Toggle Keyboard Key

**Decision**: Use the "P" key as the primary pause toggle, consistent with the spec assumption. Also listen for the "Escape" key as an additional trigger for better UX.

**Rationale**: "P" is the conventional pause key in classic games. The existing keyboard handler in `useEffect` (line 202-218 of `tetris.js`) already listens for `ArrowRight`, `ArrowLeft`, `ArrowDown`, and `Space`. Adding "P" and "Escape" follows the same pattern.

**Alternatives considered**:
- **Only "P" key**: Simpler but Escape is universally understood as a pause/menu key in games.
- **Only "Escape" key**: Less discoverable than "P" for a game context.

## R3: Board Content Hiding Strategy

**Decision**: Use conditional rendering in the `renderMatrix` function. When paused, render cells as empty (skip the `renderItem` call or force `col = 0`) so the grid structure (outline) is preserved but all colored blocks are hidden. Overlay a "Pausado" message using a positioned `div` over the `.matrix` container.

**Rationale**: The board outline comes from the `.matrix` CSS class (`border: solid`). The individual cells are rendered as `.col` divs with a fixed 25x25px size. By not rendering the colored `.item` divs inside cells, the grid outline and cell structure remain but content disappears. This matches the spec requirement: "the board outline remains visible but blocks are hidden."

**Alternatives considered**:
- **CSS `visibility: hidden` on blocks**: Would hide blocks but they'd still occupy space — similar visual result but less explicit in intent.
- **CSS `opacity: 0` on the matrix content**: Would hide everything including potential outlines.
- **Separate "paused" matrix (all zeros)**: Cleaner separation but requires rendering a different data source.

**Decision refined**: Use a separate rendering path — when paused, render a matrix of all zeros (which produces empty cells with the grid structure intact). This avoids modifying the actual game data and is the cleanest approach.

## R4: Pause Overlay ("Pausado" Message)

**Decision**: Add a positioned overlay `div` inside the `.matrix` container that is shown/hidden based on the `isPaused` state. The overlay will display "Pausado" text centered both vertically and horizontally.

**Rationale**: The `.matrix` div already contains the board. Adding an absolutely positioned child with centering via flexbox is the simplest CSS approach. No additional libraries needed.

**Alternatives considered**:
- **Modal/dialog component**: Overkill for a simple text overlay.
- **CSS pseudo-element (::after)**: Cannot be toggled via React state easily.

## R5: Next Piece Preview During Pause

**Decision**: Hide the next piece preview area during pause, per the spec assumption ("The next piece preview area is also hidden during pause to prevent strategic planning while paused").

**Rationale**: Hiding next piece prevents players from studying upcoming pieces during pause, which is standard in competitive Tetris implementations.

**Alternatives considered**:
- **Keep next piece visible**: Would allow strategic advantage during pause.

## R6: Pause Button Placement

**Decision**: Add a "Pausa" button in the existing `.controls` section, placed above or alongside the movement controls. When paused, the button label changes to "Reanudar" to indicate the resume action.

**Rationale**: The existing controls section (lines 244-257 of `tetris.js`) already has movement buttons (Left, Right, Down) and a Flip button. Adding a Pause/Resume button follows the same UI pattern.

**Alternatives considered**:
- **Separate controls area above the board**: More visible but breaks consistent layout.
- **Icon-based button**: Would require adding icon assets; text labels are simpler and match existing buttons.

## R7: Timer Handling During Pause

**Decision**: Include `isPaused` in the dependency array of the `setInterval` effect (line 192-200). When paused, the effect cleanup runs and clears the interval. When unpaused, the effect re-runs and creates a new interval. This naturally stops and restarts the 500ms fall timer.

**Rationale**: The existing effect already cleans up the interval on dependency changes (via `return () => clearInterval(intervalId)`). Adding `isPaused` to the dependency array and gating the interval creation on `!isPaused` is the most idiomatic React approach and matches the existing `isEndGame` guard.

**Alternatives considered**:
- **Pausing/resuming the interval without clearing**: More complex and not standard React pattern.
- **Using a ref to store interval state**: Unnecessary complexity for this use case.
