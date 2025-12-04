import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { playMoveSchema, restartGameSchema, getGameStateSchema, joinRoomSchema } from "../lib/zod-schemas.js";
import { rooms } from "../websocket.js";
import game from "../services/game.js";
import { P4 } from "../game/P4.js";
import { getUserIdentifier } from "../lib/auth-utils.js";

export async function gameRoutes(fastify: FastifyInstance) {
	// Validation helper
	const validateBody = (schema: z.ZodSchema) => {
		return async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
			try {
				schema.parse(request.body);
			} catch (error) {
				if (error instanceof z.ZodError) {
					reply.status(400).send({ error: "Invalid request data", details: error.issues });
					return;
				}
				reply.status(400).send({ error: "Validation error" });
			}
		};
	};

	// Obtenir l'état d'une partie
	fastify.get("/state/:roomId", async (request: FastifyRequest<{ Params: { roomId: string } }>, reply: FastifyReply) => {
		try {
			const { roomId } = getGameStateSchema.parse({ roomId: request.params.roomId });

			const room = rooms.get(roomId);
			if (!room) {
				reply.status(404).send({ error: "Game not found" });
				return;
			}

			const gameInstance = room.game as P4;
			reply.send({
				roomId,
				board: gameInstance.board,
				currentPlayer: gameInstance.cPlayer,
				win: gameInstance.win,
				isFull: gameInstance.full,
				playCount: gameInstance.playCount,
				lastMove: gameInstance.last.x >= 0 ? gameInstance.last : null,
				registeredPlayers: room.registeredPlayerList,
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				reply.status(400).send({ error: "Invalid room ID", details: error.issues });
				return;
			}
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Rejoindre ou créer une partie
	fastify.post(
		"/join",
		{
			preValidation: validateBody(joinRoomSchema),
		},
		async (request: FastifyRequest<{ Body: { roomId: string } }>, reply: FastifyReply) => {
			try {
				const userIdentifier = getUserIdentifier(request);
				if (!userIdentifier) {
					reply.status(401).send({ error: "Authentication required" });
					return;
				}

				const { roomId } = request.body;

				// Créer ou obtenir la room (l'état est en RAM)
				rooms.getOrCreate(roomId);

				reply.send({
					success: true,
					roomId,
					message: "Room joined successfully",
				});
			} catch (error) {
				reply.status(500).send({ error: "Internal server error" });
			}
		}
	);

	// Jouer un coup
	fastify.post(
		"/play",
		{
			preValidation: validateBody(playMoveSchema),
		},
		async (request: FastifyRequest<{ Body: { roomId: string; x: number } }>, reply: FastifyReply) => {
			try {
				const userIdentifier = getUserIdentifier(request);
				if (!userIdentifier) {
					reply.status(401).send({ error: "Authentication required" });
					return;
				}

				const { roomId, x } = request.body;

				const room = rooms.get(roomId);
				if (!room) {
					reply.status(404).send({ error: "Room not found" });
					return;
				}

				const player = room.playerList.find((p) => p.uuid === userIdentifier);
				if (!player || player.localId === null) {
					reply.status(403).send({ error: "You are not a player in this room" });
					return;
				}

				const gameInstance = room.game as P4;
				if (gameInstance.win || gameInstance.full || player.localId !== gameInstance.cPlayer) {
					reply.status(400).send({ error: "Invalid move" });
					return;
				}

				const y = gameInstance.play(player.localId as 1 | 2, x);
				if (y < 0) {
					reply.status(400).send({ error: "Invalid column" });
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
				room.send({
					type: "play",
					data: {
						playerId: player.localId,
						x,
						y,
						nextPlayerId: gameInstance.cPlayer,
					},
				});

				if (isWin) {
					room.send({ type: "game-win", data: { uuid: userIdentifier, playerid: player.localId } });
				} else if (isFull) {
					room.send({ type: "game-full" });
				}

				reply.send({
					success: true,
					x,
					y,
					nextPlayerId: gameInstance.cPlayer,
					win: isWin ? gameInstance.win : 0,
					isFull,
				});
			} catch (error) {
				reply.status(500).send({ error: "Internal server error" });
			}
		}
	);

	// Redémarrer une partie
	fastify.post(
		"/restart",
		{
			preValidation: validateBody(restartGameSchema),
		},
		async (request: FastifyRequest<{ Body: { roomId: string; forced?: boolean } }>, reply: FastifyReply) => {
			try {
				const userIdentifier = getUserIdentifier(request);
				if (!userIdentifier) {
					reply.status(401).send({ error: "Authentication required" });
					return;
				}

				const { roomId, forced } = request.body;

				const room = rooms.get(roomId);
				if (!room) {
					reply.status(404).send({ error: "Room not found" });
					return;
				}

				const gameInstance = room.game as P4;
				if (!gameInstance.win && !gameInstance.full && !forced) {
					reply.status(400).send({ error: "Game is still in progress" });
					return;
				}

				gameInstance.setDefault();

				// Envoyer la mise à jour via WebSocket
				room.send({ type: "restart" });
				room.send({
					type: "sync",
					data: {
						playerId: null,
						cPlayer: gameInstance.cPlayer,
					},
				});

				reply.send({
					success: true,
					message: "Game restarted",
				});
			} catch (error) {
				reply.status(500).send({ error: "Internal server error" });
			}
		}
	);
}
