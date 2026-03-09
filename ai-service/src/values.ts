/**
 * Scoring values used by the minimax evaluation function.
 *
 * Terminal outcomes use very large values to dominate all positional scores.
 * Window scores are additive across the board, so they must stay much smaller.
 */

// ── Terminal outcomes ──────────────────────────────────────────────────────────

/** AI wins the game (4-in-a-row). */
export const WIN = 10_000_000;

/** Opponent wins the game — negated in the evaluator. */
export const LOSS = -10_000_000;

/** Board is full, no winner. */
export const DRAW = 0;

// ── Window scores (applied per 4-cell window across the board) ─────────────────

/** AI has 4 in the window → guaranteed win (redundant with WIN but kept for clarity). */
export const WINDOW_4_AI = 100;

/** AI has 3 + 1 empty → strong threat. */
export const WINDOW_3_AI = 5;

/** AI has 2 + 2 empty → developing threat. */
export const WINDOW_2_AI = 2;

/** Opponent has 3 + 1 empty → must block. */
export const WINDOW_3_OPP = -4;

// ── Positional bonus ───────────────────────────────────────────────────────────

/**
 * Bonus per AI piece in the centre column (col 3).
 * The centre is the most flexible position in Connect 4.
 */
export const CENTER_COLUMN_BONUS = 3;
