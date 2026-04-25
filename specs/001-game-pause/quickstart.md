# Quickstart: Game Pause Feature

## Prerequisites

- Node.js installed
- Project dependencies installed (`npm install`)

## Running the App

```bash
cd /Users/ntolosa/repositories/tetris
npm start
```

The app runs at `http://localhost:3000`.

## Running Tests

```bash
npm test
```

## Feature Overview

The game pause feature adds the ability to pause/resume the Tetris game:

1. **Keyboard**: Press `P` or `Escape` to toggle pause
2. **Button**: Click the "Pausa" / "Reanudar" button in the controls area
3. **While paused**:
   - Pieces stop falling
   - Movement/rotation inputs are ignored
   - Board shows only the outline (blocks hidden)
   - "Pausado" message appears centered on the board
   - Next piece preview is hidden
4. **On resume**: Game continues exactly from where it was paused

## Files Modified

| File | Change |
| ---- | ------ |
| `src/components/tetris/tetris.js` | Add `isPaused` state, pause toggle logic, input blocking, conditional rendering |
| `src/components/tetris/tetris.scss` | Add styles for pause overlay and button state |
| `src/components/tetris/tetris.spec.js` | Add tests for pause/resume behavior |

## Architecture Notes

- **State**: Simple `useState(false)` for `isPaused`, following existing `isEndGame` pattern
- **Timer**: The 500ms `setInterval` is gated on `!isPaused && !isEndGame`
- **Rendering**: When paused, the `renderMatrix` function renders empty cells (preserving grid outline)
- **Overlay**: Absolutely positioned `div` inside `.matrix` container with flexbox centering
