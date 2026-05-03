# Quickstart: Game Start Feature

## Overview

This feature adds an explicit start flow to the Tetris game. Instead of pieces falling immediately on load, the game displays an empty board with a single "Iniciar" button. Game controls are hidden until the player starts the game.

## What Changes

### For Players
- Game no longer auto-starts on page load
- Empty board with "Iniciar" button is shown initially
- Game controls (move, rotate, drop, pause) appear only after starting
- After game over, the game returns to the start screen

### For Developers

**Files affected** (all in `src/components/tetris/`):
- `tetris.js` — Replace `isEndGame`/`isPaused` with single `gameStatus` state, add `startGame()` callback, conditional rendering
- `tetris.scss` — Start button styles
- `tetris.spec.js` — New tests for idle state and start flow

**Key state change** (replaces `isEndGame` + `isPaused`):
```javascript
const [gameStatus, setGameStatus] = useState('idle');
// Values: 'idle' | 'playing' | 'paused' | 'gameover'
```

**New callback**:
```javascript
const startGame = useCallback(() => {
    setGameStatus('playing');
    setFichaMetadata(/* fresh initial state with first piece */);
}, []);
```

**Conditional rendering pattern**:
```jsx
{gameStatus === 'idle' && <button onClick={startGame}>Iniciar</button>}
{gameStatus !== 'idle' && <div className='controls'>...</div>}
{gameStatus === 'playing' && <div className='next'>...</div>}
```

## How to Test

```bash
# Run unit tests
npm test

# Manual testing
npm start
# 1. Verify empty board with "Iniciar" button on load
# 2. Verify no game controls visible
# 3. Click "Iniciar" — game begins, controls appear
# 4. Play until game over — verify return to idle state
```

## Dependencies

- Depends on feature 001-game-pause being implemented (pause state interactions)
- No new external dependencies
