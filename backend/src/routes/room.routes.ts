import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createRoom, listAllRooms, getRoomById } from "../services/room.service.js";
import { z } from "zod";
import { HttpError } from "../lib/HttpError.js";
import { manager } from "../websocket.js";
import { generateToken } from "../lib/jwt.js";
import { env } from "../config/env.js";

export function roomRoutes(fastify: FastifyInstance) {

	fastify.get("/", async (_, reply: FastifyReply) => {
		const rooms = listAllRooms();
		reply.send(rooms);
	});

	fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
		const { name, players } = z
			.object({
				name: z.string().max(20).optional(),
				players: z.array(z.string().uuid()).optional(),
			})
			.parse(request.body);
		const room = createRoom(name, players);
		reply.send({ success: true, roomId: room.id });
	});

	fastify.post("/ai", async (_request: FastifyRequest, reply: FastifyReply) => {
		const room = manager.newRoom({});

		// Generate a short-lived JWT for the AI bot to authenticate via WS
		const token = generateToken({
			id: env.aiService.botId,
			email: "ai@bot.local",
			login: "AI",
		});

		// Notify the AI service to join the room
		try {
			const res = await fetch(`${env.aiService.url}/join`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ roomId: room.id, token }),
			});
			if (!res.ok) {
				fastify.log.warn(`AI service responded with ${res.status}`);
			}
		} catch (error) {
			fastify.log.warn({ error }, "Failed to notify AI service — room still created");
		}

		reply.send({ success: true, roomId: room.id });
	});

	fastify.get("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		const room = getRoomById(id);
		if (!room) {
			throw HttpError.notFound("Room not found");
		}
		reply.send(room);
	});
}