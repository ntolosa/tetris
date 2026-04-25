# Feature Specification: Game Pause

**Feature Branch**: `001-game-pause`  
**Created**: 2026-04-18  
**Status**: Draft  
**Input**: User description: "Agregar una feature para pausar el juego. El usuario puede pausarlo apretando un botón o una tecla del teclado. Cuando el juego esté pausado el usuario no puede mover las fichas de ninguna forma, el tablero deja de verse (pero se ve el contorno) y sobre el tablero se muestra un mensaje de 'Pausado'."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pause the Game (Priority: P1)

The player is in the middle of a game and needs to take a break. They press a designated keyboard key or click a visible pause button on the screen. The game immediately freezes: pieces stop falling, input for moving or rotating pieces is ignored, the board content is hidden (only the board outline remains visible), and a "Pausado" message is displayed prominently over the board area.

**Why this priority**: This is the core functionality of the feature. Without the ability to pause, the entire feature has no value.

**Independent Test**: Can be fully tested by starting a game, pressing the pause key or button, and verifying the game enters the paused state with all expected visual and behavioral changes.

**Acceptance Scenarios**:

1. **Given** the game is actively running with a piece falling, **When** the player presses the pause keyboard key, **Then** the piece stops falling, the board content is hidden (only the outline is visible), and a "Pausado" message appears centered over the board area.
2. **Given** the game is actively running, **When** the player clicks the pause button on the interface, **Then** the same paused state is entered as when using the keyboard key.
3. **Given** the game is paused, **When** the player attempts to move, rotate, or drop a piece using keyboard controls, **Then** no piece movement or rotation occurs.

---

### User Story 2 - Resume the Game (Priority: P1)

The player has paused the game and is ready to continue playing. They press the same keyboard key or click the pause/resume button. The game resumes exactly from where it was: the board content reappears, pieces continue falling from their frozen position, and player input is re-enabled.

**Why this priority**: Resuming is inseparable from pausing — a pause feature without resume is unusable.

**Independent Test**: Can be tested by pausing the game, then pressing the resume key/button and verifying the game returns to its pre-pause state with all controls restored.

**Acceptance Scenarios**:

1. **Given** the game is paused, **When** the player presses the pause keyboard key again, **Then** the board content reappears, the "Pausado" message disappears, pieces resume falling, and player input is re-enabled.
2. **Given** the game is paused, **When** the player clicks the pause/resume button, **Then** the game resumes identically to using the keyboard key.
3. **Given** the game is paused and a piece was mid-fall, **When** the player resumes, **Then** the piece continues from its exact pre-pause position with the fall timer restarting.

---

### User Story 3 - Visual Feedback During Pause (Priority: P2)

While the game is paused, the player sees a clear visual distinction from the active game state. The board area shows only its outline (empty grid border) without revealing the positions of placed blocks or the active piece. A "Pausado" message is displayed prominently and centered on the board. The pause button visually indicates the game is paused (e.g., changes icon or label to indicate "resume").

**Why this priority**: Visual feedback is essential for a polished user experience, but the core pause/resume mechanics take precedence.

**Independent Test**: Can be tested by pausing the game and visually inspecting that the board content is hidden, the outline remains visible, and the "Pausado" overlay is displayed correctly.

**Acceptance Scenarios**:

1. **Given** the game is paused, **When** the player looks at the board area, **Then** placed blocks and the active piece are not visible, but the board outline (border/grid frame) remains.
2. **Given** the game is paused, **When** the player looks at the board area, **Then** a "Pausado" message is displayed centered over the board.
3. **Given** the game is paused, **When** the player looks at the pause button, **Then** the button visually indicates the game can be resumed (e.g., shows a play icon or "Reanudar" label).

---

### Edge Cases

- What happens when the player presses pause before the first piece has appeared (game just started)? The game should still enter the paused state.
- What happens when the player presses pause during a line-clearing animation? The animation should complete before the pause takes effect, or the pause should take effect immediately and the animation resumes upon unpause.
- What happens when the game is over (game over screen) and the player presses the pause key? Nothing should happen — pause is only available during active gameplay.
- What happens if the player rapidly toggles pause on/off? The game should handle rapid toggling without errors or visual glitches.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a keyboard key that toggles the game between paused and active states.
- **FR-002**: The system MUST provide a clickable button in the user interface that toggles the game between paused and active states.
- **FR-003**: When the game is paused, the system MUST stop all automatic piece movement (gravity/falling).
- **FR-004**: When the game is paused, the system MUST ignore all player input related to piece movement (move left, move right, rotate, soft drop, hard drop).
- **FR-005**: When the game is paused, the system MUST hide all placed blocks and the active piece from the board display.
- **FR-006**: When the game is paused, the system MUST keep the board outline (border/frame) visible.
- **FR-007**: When the game is paused, the system MUST display a "Pausado" message centered over the board area.
- **FR-008**: When the game is resumed, the system MUST restore the full board display (placed blocks and active piece).
- **FR-009**: When the game is resumed, the system MUST re-enable all player input for piece movement.
- **FR-010**: When the game is resumed, the system MUST restart the automatic piece falling from the piece's pre-pause position.
- **FR-011**: The pause functionality MUST only be available during active gameplay (not during game over or before the game starts).
- **FR-012**: The pause button MUST visually indicate the current state (paused vs. active) to the player.

### Key Entities

- **Game State**: Represents the current state of the game, now extended with a "paused" state in addition to existing states (e.g., playing, game over).
- **Pause Overlay**: The visual element displayed over the board during pause, containing the "Pausado" message and hiding game content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can pause and resume the game within 1 second of pressing the key or clicking the button (instant feedback).
- **SC-002**: 100% of piece movement inputs are blocked while the game is paused.
- **SC-003**: The board content is fully hidden during pause — no placed blocks or active piece are visible.
- **SC-004**: The "Pausado" message is visible and legible when the game is paused.
- **SC-005**: The game resumes from the exact state it was in before pausing, with no loss of progress or position data.
- **SC-006**: Rapid toggling of pause/resume (5+ times in 2 seconds) does not cause visual glitches or errors.

## Assumptions

- The game already has a defined set of game states (e.g., playing, game over) that can be extended with a "paused" state.
- The pause keyboard key will be the "P" key, following common conventions for games. The Escape key is also a reasonable alternative, but "P" is assumed as default.
- The game has an existing user interface area where a pause button can be added alongside other game controls.
- The score, level, and other game statistics remain visible during pause (only the board content is hidden).
- The "next piece" preview area is also hidden during pause to prevent strategic planning while paused.
