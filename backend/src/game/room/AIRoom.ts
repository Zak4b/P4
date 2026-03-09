import { Room } from "./Room.js";
import { P4 } from "../P4.js";
import { getBestMove } from "../AI.js";

export const AI_BOT_UUID = "ai-bot";
export const AI_BOT_NAME = "AI";

export class AIRoom extends Room<typeof P4> {
	constructor(id: string) {
		super({
			id,
			playerLimit: 1,
			game: P4,
		});
		// Register AI as player 2 (human will get player 1)
		this.registerBot(AI_BOT_UUID, 2);

		const game = this.game as P4;
		game.on("play", ({ nextPlayerId }) => {
			if (nextPlayerId === 2 && !game.isEnded) {
				this.triggerAIMove();
			}
		});
	}

	private async triggerAIMove(): Promise<void> {
		const game = this.game as P4;
		// Small delay for a more natural feel
		await new Promise((resolve) => setTimeout(resolve, 400));
		if (game.isEnded || game.cPlayer !== 2) return;

		const col = getBestMove(game.board, 2);
		try {
			const { y } = await game.play(2, col);
			await this.send({
				type: "play",
				data: { playerId: 2, x: col, y, nextPlayerId: game.cPlayer },
			});
		} catch {
			// Game may have ended between calculation and play
		}
	}
}
