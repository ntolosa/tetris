# Feature Specification: Game Start

**Feature Branch**: `002-game-start`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "Agregar una feature para que el juego no empiece directamente, sino que esté frenado y con una acción del usuario el juego inicie. La acción del usuario debe ser un botón de inicio. Hasta que el juego no inicie, no se debería ver la siguiente ficha."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start the Game (Priority: P1)

The player opens the Tetris application and sees the empty game board with its outline, along with a prominent "Iniciar" (Start) button. No pieces are falling, no next piece preview is shown, and no game control buttons (move, rotate, drop, pause) are visible. The player clicks the start button, and the game begins immediately: the first piece appears and starts falling, the next piece preview becomes visible, the game control buttons appear, and the start button is no longer available.

**Why this priority**: This is the core functionality of the feature. Without the ability to explicitly start the game, the feature has no value. The game must remain idle until the player decides to begin.

**Independent Test**: Can be fully tested by opening the application, verifying the game is in an idle state (no pieces falling, no next piece visible, start button present), clicking the start button, and confirming the game transitions to active gameplay.

**Acceptance Scenarios**:

1. **Given** the player opens the application for the first time, **When** the game board loads, **Then** no pieces are falling, the board is empty, the next piece preview is hidden, game control buttons (move, rotate, drop, pause) are not visible, and only a "Iniciar" button is visible.
2. **Given** the game is in the idle (not started) state, **When** the player clicks the "Iniciar" button, **Then** the first piece appears on the board and begins falling, the next piece preview becomes visible, game control buttons appear, and player input for piece movement is enabled.
3. **Given** the game is in the idle state, **When** the player attempts to move, rotate, or drop a piece using keyboard controls, **Then** no piece movement occurs because no piece exists on the board.

---

### User Story 2 - Visual Feedback in Idle State (Priority: P2)

While the game has not started, the player sees a clear visual distinction from the active game state. The board area shows only its outline (empty grid), no score or level counters are advancing, the next piece preview area is empty or hidden, and game control buttons (move, rotate, drop, pause) are not visible. Only the start button is prominently displayed, indicating the game is ready to begin.

**Why this priority**: Visual feedback ensures the player understands that the game is waiting for their action. Without clear idle state visuals, the player may be confused about the application's state.

**Independent Test**: Can be tested by opening the application and visually inspecting that the board is empty, the next piece preview is hidden, and the start button is clearly visible and inviting.

**Acceptance Scenarios**:

1. **Given** the game has not started, **When** the player looks at the board area, **Then** the board is empty with only the outline/border visible (no pieces or blocks).
2. **Given** the game has not started, **When** the player looks at the next piece preview area, **Then** no piece is displayed in the preview.
3. **Given** the game has not started, **When** the player looks at the interface, **Then** game control buttons (move, rotate, drop, pause) are not visible, and only the "Iniciar" button is prominently visible.
4. **Given** the game has started (player clicked the button), **When** the player looks at the interface, **Then** the "Iniciar" button is no longer visible, and game control buttons (move, rotate, drop, pause) become visible.

---

### User Story 3 - Restart After Game Over (Priority: P2)

After a game over, the player should be able to start a new game. The application returns to the idle state with the start button visible, allowing the player to begin a fresh game when ready.

**Why this priority**: This ensures the start flow is consistent across the full game lifecycle, not just the initial load. Players expect to be able to replay without refreshing the page.

**Independent Test**: Can be tested by playing until game over, verifying the idle state returns with the start button available, and clicking start to begin a new game.

**Acceptance Scenarios**:

1. **Given** the game has ended (game over), **When** the game over sequence completes, **Then** the application displays the start button and returns to the idle state.
2. **Given** the application is in the idle state after a game over, **When** the player clicks the "Iniciar" button, **Then** a new game begins with a fresh board, reset score, and new pieces.

---

### Edge Cases

- What happens if the player rapidly clicks the start button multiple times? Only the first click should have an effect; subsequent clicks should be ignored once the game is active.
- What happens if the player presses keyboard game controls (move, rotate, drop) before starting the game? All game-related inputs should be ignored in the idle state.
- What happens if the game was previously paused (from feature 001-game-pause) and then ended? The idle state should take precedence; pause state should not interfere with the pre-start idle state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When the application loads, the system MUST display the game board in an idle state with no pieces falling and no active game logic running.
- **FR-002**: The system MUST display a visible "Iniciar" button that allows the player to start the game.
- **FR-003**: When the player clicks the "Iniciar" button, the system MUST transition from the idle state to the active gameplay state.
- **FR-004**: In the idle state, the system MUST hide the next piece preview (no piece shown in the preview area).
- **FR-004b**: In the idle state, the system MUST hide all game control buttons (move, rotate, drop, pause). Only the "Iniciar" button MUST be visible.
- **FR-004c**: When the game starts, the system MUST show all game control buttons (move, rotate, drop, pause).
- **FR-005**: In the idle state, the system MUST ignore all player input related to piece movement (move left, move right, rotate, soft drop, hard drop).
- **FR-006**: When the game starts, the system MUST generate and display the first piece on the board and begin automatic piece falling.
- **FR-007**: When the game starts, the system MUST show the next piece preview.
- **FR-008**: Once the game has started, the "Iniciar" button MUST no longer be clickable or visible.
- **FR-009**: After a game over, the system MUST return to the idle state with the "Iniciar" button available for a new game.
- **FR-010**: The pause functionality (feature 001-game-pause) MUST only be available during active gameplay, not during the idle state.

### Key Entities

- **Game State**: Extended with an "idle" state in addition to existing states (playing, paused, game over). The idle state is the initial state when the application loads and after a game over.
- **Start Button**: The interactive element that transitions the game from idle to active gameplay.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The game does not begin (no pieces fall) until the player explicitly clicks the start button.
- **SC-002**: 100% of piece movement inputs are ignored while the game is in the idle state.
- **SC-003**: The next piece preview is hidden in the idle state and becomes visible within 1 second of the game starting.
- **SC-003b**: Game control buttons are hidden in the idle state and become visible within 1 second of the game starting.
- **SC-004**: The start button is visible and accessible on initial load and after game over.
- **SC-005**: The transition from idle to active gameplay occurs within 1 second of clicking the start button (instant feedback).
- **SC-006**: Multiple rapid clicks on the start button do not cause errors or multiple game instances.

## Assumptions

- The game currently starts automatically when the application loads; this feature changes that behavior to require explicit user action.
- The "Iniciar" button will be placed in the game interface alongside other game controls (e.g., near the pause button from feature 001-game-pause).
- The score, level, and lines counters are visible in the idle state but show their initial values (zero/starting values).
- The existing game over flow will be extended to transition back to the idle state instead of any current behavior.
- The pause feature (001-game-pause) remains functional but is only available during active gameplay, not during the idle state.
