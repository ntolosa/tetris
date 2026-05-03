# Data Model: Game Pause

## Entities

### Game State (extended)

The game's runtime state is currently managed by two variables in the `Tetris` component. This feature extends it with a third.

| Field          | Type      | Description                                          | Current / New |
| -------------- | --------- | ---------------------------------------------------- | ------------- |
| `fichaMetadata`| Object    | Contains x, y position, matrix, ficha, nextFicha     | Current       |
| `isEndGame`    | Boolean   | Whether the game has ended (game over)               | Current       |
| `isPaused`     | Boolean   | Whether the game is currently paused                 | **New**       |

### State Transitions

```
[Playing] --(press P / click Pause)--> [Paused]
[Paused]  --(press P / click Resume)--> [Playing]
[Playing] --(collision at top)--> [Game Over]
[Game Over] -- (no transitions to Paused allowed)
```

**Rules**:
- Pause toggle is only valid when `isEndGame === false`
- When `isPaused === true`:
  - `setInterval` for gravity is not active (cleared)
  - Keyboard input for movement/rotation is blocked
  - Board renders as empty grid (all cells = 0)
  - "Pausado" overlay is visible
  - Next piece preview is hidden
- When `isPaused === false` (resume):
  - `setInterval` restarts with fresh 500ms cycle
  - All keyboard/button controls re-enabled
  - Board renders normally from `fichaMetadata.matrix`
  - Overlay hidden
  - Next piece preview visible

### Pause Overlay

| Field    | Type   | Description                                     |
| -------- | ------ | ----------------------------------------------- |
| visible  | Boolean| Derived from `isPaused` state                   |
| text     | String | Fixed: "Pausado"                                |
| position | Layout | Absolutely positioned, centered over `.matrix`  |

### Pause Button

| Field    | Type   | Description                                       |
| -------- | ------ | ------------------------------------------------- |
| label    | String | "Pausa" when playing, "Reanudar" when paused      |
| onClick  | Action | Toggles `isPaused` state                          |
| disabled | Boolean| `true` when `isEndGame === true`                  |
