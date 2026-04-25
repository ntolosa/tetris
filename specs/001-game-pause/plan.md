# Implementation Plan: Game Pause

**Branch**: `001-game-pause` | **Date**: 2026-04-18 | **Spec**: [spec.md](file:///Users/ntolosa/repositories/tetris/specs/001-game-pause/spec.md)  
**Input**: Feature specification from `specs/001-game-pause/spec.md`

## Summary

Add a pause/resume feature to the Tetris game. The player can press "P" (or Escape) or click a button to toggle pause. When paused: pieces stop falling, all input is blocked, the board content is hidden (outline remains), a "Pausado" overlay appears, and the next piece preview is hidden. On resume, the game continues from the exact pre-pause state.

## Technical Context

**Language/Version**: JavaScript (ES6+), React 18.3  
**Primary Dependencies**: React (`useState`, `useCallback`, `useEffect`), SCSS  
**Storage**: N/A (in-memory state only)  
**Testing**: Jest + React Testing Library  
**Target Platform**: Web browser (CRA dev server)  
**Project Type**: Web application (single-page)  
**Performance Goals**: Instant pause/resume (<16ms frame), no timer drift  
**Constraints**: No additional dependencies allowed  
**Scale/Scope**: Single component (~266 lines), 3 files modified

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is a template (not filled in). No gates to enforce. ✅ Pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-game-pause/
├── plan.md              # This file
├── research.md          # Phase 0 output — all decisions resolved
├── data-model.md        # Phase 1 output — state extensions
├── quickstart.md        # Phase 1 output — dev guide
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── app/
│   │   ├── App.js           # No changes needed
│   │   ├── App.css           # No changes needed
│   │   └── App.test.js       # No changes needed
│   └── tetris/
│       ├── tetris.js         # MODIFY — add isPaused state, toggle, input blocking, conditional rendering, overlay, button
│       ├── tetris.scss       # MODIFY — add pause overlay styles, button styles
│       └── tetris.spec.js    # MODIFY — add pause/resume tests
├── constants/
│   └── fichas.js             # No changes needed
├── index.js                  # No changes needed
└── index.css                 # No changes needed
```

**Structure Decision**: Single project structure. All changes are within the existing `src/components/tetris/` directory. No new files or directories are created in `src/`.

## Detailed Changes

### tetris.js — Main Component

#### 1. Add `isPaused` state
```javascript
const [isPaused, setIsPaused] = useState(false);
```

#### 2. Add `togglePause` callback
```javascript
const togglePause = useCallback(() => {
    if (!isEndGame) {
        setIsPaused(prev => !prev);
    }
}, [isEndGame]);
```

#### 3. Gate the gravity interval on `isPaused`
Modify the `useEffect` at line 192-200 to include `isPaused` in the dependency array and guard interval creation:
```javascript
useEffect(() => {
    if (isEndGame || isPaused) {
        return;
    }
    const intervalId = setInterval(() => {
        setFichaMetadata(prev => changePosition(prev));
    }, 500);
    return () => clearInterval(intervalId);
}, [changePosition, isEndGame, isPaused]);
```

#### 4. Block input when paused
Modify the keyboard handler `useEffect` (line 202-218) to early-return when paused. Also guard button callbacks:
```javascript
useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
            togglePause();
            return;
        }
        if (isPaused) return; // Block all other input
        // ... existing handlers
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [manualMovement, manualMovementVertical, flipFicha, isPaused, togglePause]);
```

#### 5. Conditional rendering for paused board
Modify the JSX to render an empty matrix when paused and show the overlay:
```jsx
<div className='matrix' style={{ position: 'relative' }}>
    {renderMatrix(isPaused ? fichaMatrix : fichaMetadata.matrix)}
    {isPaused && (
        <div className='pause-overlay'>Pausado</div>
    )}
</div>
```

#### 6. Hide next piece when paused
```jsx
<div className='next'>
    {!isPaused && renderMatrix(fichaMetadata.nextFicha)}
</div>
```

#### 7. Add Pause/Resume button
Add a button in the controls section:
```jsx
<div className='controls__pause'>
    <button onClick={togglePause} disabled={isEndGame}>
        {isPaused ? 'Reanudar' : 'Pausa'}
    </button>
</div>
```

#### 8. Guard button handlers when paused
Wrap button `onClick` handlers to check `isPaused`:
```jsx
<button onClick={() => !isPaused && manualMovement(-1)}>Left</button>
```

### tetris.scss — Styles

#### Add pause overlay styles
```scss
.pause-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 10;
}

.controls__pause {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
}
```

### tetris.spec.js — Tests

Add tests for:
1. Pause button renders with "Pausa" label
2. Clicking pause button changes label to "Reanudar"
3. Pause overlay appears when paused
4. Pause button is disabled when game is over

## Complexity Tracking

No constitution violations to justify — constitution is not configured.
