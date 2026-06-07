# How it works

## How to use

### Step 1 - Number of locks

Select how many locks the mechanism has (3 to 7).

### Step 2 - Initial pin positions

Locks are numbered **1 (front) to N (back)**, matching the in-game layout shown in the reference image.
For each lock, click its current pin position (1–7). Position **4 is the centre** and the goal for every pin.

When you change the lock count or reset the app, new locks default to position 4.

### Step 3 - Lock interactions

The table defines what happens to **other locks** when a given lock moves left.

| Table axis                  | Order                              |
| --------------------------- | ---------------------------------- |
| Rows (lock that moves left) | Descending - N at top, 1 at bottom |
| Columns (affected lock)     | Ascending - 1 at left, N at right  |

For each cell, pick one of three options:

- `←` - the other lock moves left (its pin goes right, +1)
- `–` - the other lock stays still
- `→` - the other lock moves right (its pin goes left, −1)

Default for all cells is `–` (no effect).

> When a lock moves `→` (right), the effects on other locks are the exact inverse of the left-movement settings.

### Step 4 - Solve

Press **Solve**. The tool computes the shortest possible sequence of moves using BFS and displays it below.

If every pin is already at position 4, the app reports that the lock is already open (no moves needed).

---

## Sharing and importing

The share bar at the top of the page provides four actions:

| Action          | What it does                                                                   |
| --------------- | ------------------------------------------------------------------------------ |
| **Copy Code**   | Copies a compact share code to the clipboard                                   |
| **Copy Link**   | Copies the current page URL with the configuration in a `?code=` parameter     |
| **Import Code** | Opens a dialog to paste a share code or link; imports and solves automatically |
| **Reset**       | Restores the default 3-lock setup and clears any `?code=` from the URL         |

Opening a link that contains `?code=...` loads and solves that configuration on page load. If the code is invalid, an error message is shown briefly at the top of the page.

### Share code format

Codes use the pattern `G1L1.{locks}.{pins}.{effects}`:

- **G1L1** - format version identifier
- **locks** - single digit, 3–7
- **pins** - one digit per lock (1–7), in lock order 1 through N
- **effects** - one character per off-diagonal cell in row-major order (source lock 1→N, target lock 1→N, skipping self):
  - `L` = other lock moves left (`←`)
  - `-` = no effect (`–`)
  - `R` = other lock moves right (`→`)

Example for 3 locks with pins at 2, 5, 3 and no interactions: `G1L1.3.253.------`

---

## Physics

| Lock body movement   | Pin movement                    |
| -------------------- | ------------------------------- |
| Lock moves ← (left)  | Pin goes → (right), position +1 |
| Lock moves → (right) | Pin goes ← (left), position −1  |

This applies both to the moved lock and to any coupled locks - the table defines where the **lock body** goes, and the pin always moves in the opposite direction.

No suggested move will ever push any pin outside the valid range **[1, 7]**, including cascading effects on coupled locks.

---

## Solution features

### Step list

Each step names the lock to move and the direction (← LEFT or → RIGHT). A summary shows the total number of moves in the shortest path.

### Pin preview (optional)

By default, steps show only the move instruction. Enable **"Show pin preview per step"** to display a colour-coded pip track for every lock after each move (and a **Start** card with the initial state). Locks are shown in ascending order (Lock 1 on the left, Lock N on the right). Gold marks the active pin; green marks a pin that has reached position 4.

### Mark steps as done

**Click any step card** to dim it (opacity drops to near zero, greyscale filter applied). This lets you track your progress while playing without losing your place. Click the same step again to restore it.

### Group consecutive repeated moves

If the solution contains multiple consecutive moves of the same lock in the same direction, a toggle appears: **"Group consecutive repeated moves"**. It is **enabled by default**, collapsing those moves into a single step labelled **×N**, showing only the final pin state after all N repetitions.

---

## Algorithm

The solver uses **Breadth-First Search** over the full state space of pin positions.

- **State**: a vector of N pin positions, each in [1, 7]
- **State space**: up to 7^N states (e.g. 7^7 = 823 543 for 7 locks)
- **Goal**: all pins at position 4
- **Move generation**: for each lock, try moving it left or right; apply physics to the moved lock and all coupled locks; discard any move that pushes a pin out of [1, 7]
- **Guarantee**: the returned sequence is always the **shortest** possible
- **Search limit**: the search stops after visiting 700 000 states; if the limit is reached, an error explains that no solution was found within the limit or the sequence may be exceptionally long
- **Fallback**: if no solution exists, a clear error message is shown
