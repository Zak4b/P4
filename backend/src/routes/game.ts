import express from "express";
import { z } from "zod";
import { playMoveSchema, restartGameSchema, getGameStateSchema, joinRoomSchema } from "../lib/zod-schemas.js";
import { rooms } from "../websocket.js";
import game from "../actions/game.js";
import { P4 } from "../class/P4.js";
import { getUserIdentifier } from "../lib/auth-utils.js";

export const gameRouter = express.Router();

// Validation middleware
const validate = (schema: z.ZodSchema) => {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ error: "Invalid request data", details: error.issues });
				return;
			}
			next(error);
		}
	};
};

// Obtenir l'état d'une partie
gameRouter.get("/state/:roomId", async (req, res, next) => {
	try {
		const { roomId } = getGameStateSchema.parse({ roomId: req.params.roomId });
		
		const room = rooms.get(roomId);
		if (!room) {
			res.status(404).json({ error: "Game not found" });
			return;
		}

		const gameInstance = room.game as P4;
		res.json({
			roomId,
			board: gameInstance.board,
			currentPlayer: gameInstance.cPlayer,
			win: gameInstance.win,
			isFull: gameInstance.full,
			playCount: gameInstance.playCount,
			lastMove: gameInstance.last.x >= 0 ? gameInstance.last : null,
			registeredPlayers: room.registeredPlayerList.map((p) => ({
				uuid: p.uuid,
				playerId: p.playerId,
			})),
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			res.status(400).json({ error: "Invalid room ID", details: error.issues });
			return;
		}
		next(error);
	}
});

// Rejoindre ou créer une partie
gameRouter.post("/join", validate(joinRoomSchema), async (req, res, next) => {
	try {
		const userIdentifier = getUserIdentifier(req);
		if (!userIdentifier) {
			res.status(401).json({ error: "Authentication required" });
			return;
		}

		const { roomId } = req.body;
		
		// Créer ou obtenir la room (l'état est en RAM)
		rooms.getOrCreate(roomId);

		res.json({
			success: true,
			roomId,
			message: "Room joined successfully",
		});
	} catch (error) {
		next(error);
	}
});

// Jouer un coup
gameRouter.post("/play", validate(playMoveSchema), async (req, res, next) => {
	try {
		const userIdentifier = getUserIdentifier(req);
		if (!userIdentifier) {
			res.status(401).json({ error: "Authentication required" });
			return;
		}

		const { roomId, x } = req.body;

		const room = rooms.get(roomId);
		if (!room) {
			res.status(404).json({ error: "Room not found" });
			return;
		}

		const player = room.playerList.find((p) => p.uuid === userIdentifier);
		if (!player || player.playerId === null) {
			res.status(403).json({ error: "You are not a player in this room" });
			return;
		}

		const gameInstance = room.game as P4;
		if (gameInstance.win || gameInstance.full || player.playerId !== gameInstance.cPlayer) {
			res.status(400).json({ error: "Invalid move" });
			return;
		}

		const y = gameInstance.play(player.playerId as 1 | 2, x);
		if (y < 0) {
			res.status(400).json({ error: "Invalid column" });
			return;
		}

		const isWin = gameInstance.check(x, y);
		const isFull = gameInstance.full;

		if (isWin || isFull) {
			const registeredPlayers = room.registeredPlayerList;
			const p1 = registeredPlayers.find((p) => p.playerId === 1);
			const p2 = registeredPlayers.find((p) => p.playerId === 2);
			if (p1 && p2) {
				await game.save(p1.uuid, p2.uuid, gameInstance.win, JSON.stringify(gameInstance.board));
			}
		}

		// Envoyer la mise à jour via WebSocket
		room.send("play", {
			playerId: player.playerId,
			x,
			y,
			nextPlayerId: gameInstance.cPlayer,
		});

		if (isWin) {
			room.send("game-win", { uuid: userIdentifier, playerid: player.playerId });
		} else if (isFull) {
			room.send("game-full");
		}

		res.json({
			success: true,
			x,
			y,
			nextPlayerId: gameInstance.cPlayer,
			win: isWin ? gameInstance.win : 0,
			isFull,
		});
	} catch (error) {
		next(error);
	}
});

// Redémarrer une partie
gameRouter.post("/restart", validate(restartGameSchema), async (req, res, next) => {
	try {
		const userIdentifier = getUserIdentifier(req);
		if (!userIdentifier) {
			res.status(401).json({ error: "Authentication required" });
			return;
		}

		const { roomId, forced } = req.body;

		const room = rooms.get(roomId);
		if (!room) {
			res.status(404).json({ error: "Room not found" });
			return;
		}

		const gameInstance = room.game as P4;
		if (!gameInstance.win && !gameInstance.full && !forced) {
			res.status(400).json({ error: "Game is still in progress" });
			return;
		}

		gameInstance.setDefault();

		// Envoyer la mise à jour via WebSocket
		room.send("restart");
		room.send("sync", {
			playerId: null,
			cPlayer: gameInstance.cPlayer,
		});

		res.json({
			success: true,
			message: "Game restarted",
		});
	} catch (error) {
		next(error);
	}
});

