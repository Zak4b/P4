type Board = number[][];

function isValidMove(board: Board, col: number): boolean {
	return board[col][5] === 0;
}

function dropPiece(board: Board, col: number, player: number): Board {
	const newBoard = board.map((c) => [...c]);
	const row = newBoard[col].indexOf(0);
	newBoard[col][row] = player;
	return newBoard;
}

function checkWinner(board: Board, player: number): boolean {
	// Horizontal
	for (let r = 0; r < 6; r++) {
		for (let c = 0; c < 4; c++) {
			if (
				board[c][r] === player &&
				board[c + 1][r] === player &&
				board[c + 2][r] === player &&
				board[c + 3][r] === player
			)
				return true;
		}
	}
	// Vertical
	for (let c = 0; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			if (
				board[c][r] === player &&
				board[c][r + 1] === player &&
				board[c][r + 2] === player &&
				board[c][r + 3] === player
			)
				return true;
		}
	}
	// Diagonal /
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 3; r++) {
			if (
				board[c][r] === player &&
				board[c + 1][r + 1] === player &&
				board[c + 2][r + 2] === player &&
				board[c + 3][r + 3] === player
			)
				return true;
		}
	}
	// Diagonal \
	for (let c = 3; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			if (
				board[c][r] === player &&
				board[c - 1][r + 1] === player &&
				board[c - 2][r + 2] === player &&
				board[c - 3][r + 3] === player
			)
				return true;
		}
	}
	return false;
}

function isTerminal(board: Board): boolean {
	return (
		checkWinner(board, 1) ||
		checkWinner(board, 2) ||
		board.every((col) => col[5] !== 0)
	);
}

function scoreWindow(window: number[], player: number): number {
	const opp = player === 1 ? 2 : 1;
	const pc = window.filter((c) => c === player).length;
	const ec = window.filter((c) => c === 0).length;
	const oc = window.filter((c) => c === opp).length;
	if (pc === 4) return 100;
	if (pc === 3 && ec === 1) return 5;
	if (pc === 2 && ec === 2) return 2;
	if (oc === 3 && ec === 1) return -4;
	return 0;
}

function scorePosition(board: Board, player: number): number {
	let score = 0;
	// Prefer center column
	score += board[3].filter((c) => c === player).length * 3;
	// Horizontal
	for (let r = 0; r < 6; r++) {
		const row = board.map((col) => col[r]);
		for (let c = 0; c < 4; c++) {
			score += scoreWindow(row.slice(c, c + 4), player);
		}
	}
	// Vertical
	for (let c = 0; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			score += scoreWindow(board[c].slice(r, r + 4), player);
		}
	}
	// Diagonal /
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 3; r++) {
			score += scoreWindow(
				[board[c][r], board[c + 1][r + 1], board[c + 2][r + 2], board[c + 3][r + 3]],
				player
			);
		}
	}
	// Diagonal \
	for (let c = 3; c < 7; c++) {
		for (let r = 0; r < 3; r++) {
			score += scoreWindow(
				[board[c][r], board[c - 1][r + 1], board[c - 2][r + 2], board[c - 3][r + 3]],
				player
			);
		}
	}
	return score;
}

function minimax(
	board: Board,
	depth: number,
	alpha: number,
	beta: number,
	maximizing: boolean,
	aiPlayer: number
): number {
	const humanPlayer = aiPlayer === 1 ? 2 : 1;
	const validCols = [0, 1, 2, 3, 4, 5, 6].filter((c) => isValidMove(board, c));
	const terminal = isTerminal(board);

	if (depth === 0 || terminal) {
		if (terminal) {
			if (checkWinner(board, aiPlayer)) return 10_000_000;
			if (checkWinner(board, humanPlayer)) return -10_000_000;
			return 0;
		}
		return scorePosition(board, aiPlayer);
	}

	if (maximizing) {
		let value = -Infinity;
		for (const col of validCols) {
			const newBoard = dropPiece(board, col, aiPlayer);
			value = Math.max(value, minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer));
			alpha = Math.max(alpha, value);
			if (alpha >= beta) break;
		}
		return value;
	} else {
		let value = Infinity;
		for (const col of validCols) {
			const newBoard = dropPiece(board, col, humanPlayer);
			value = Math.min(value, minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer));
			beta = Math.min(beta, value);
			if (alpha >= beta) break;
		}
		return value;
	}
}

export function getBestMove(board: Board, aiPlayer: 1 | 2, depth: number = 6): number {
	const validCols = [0, 1, 2, 3, 4, 5, 6].filter((c) => isValidMove(board, c));
	let bestScore = -Infinity;
	let bestCol = validCols[Math.floor(validCols.length / 2)];

	for (const col of validCols) {
		const newBoard = dropPiece(board, col, aiPlayer);
		const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, aiPlayer);
		if (score > bestScore) {
			bestScore = score;
			bestCol = col;
		}
	}
	return bestCol;
}
