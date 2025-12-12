import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { RoomService } from "../services/room.service.js";
import { z } from "zod";
import { getUserId } from "../lib/auth-utils.js";

export async function roomRoutes(fastify: FastifyInstance) {

	fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const rooms = RoomService.listAll();
			reply.send(rooms);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
		const {name} = z.object({ name: z.string().max(20).optional() }).parse(request.body);
		//const userId = request.user?.id; // TODO add user id to room
		try {
			const room = RoomService.create(name);
			reply.send({success: true, roomId: room.id});
		} catch (error) {
			reply.status(400).send({ success: false, message: "Failed to create room" });
		}
	});

	fastify.get("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		try {
			const room = RoomService.get(request.params.id);
			if (!room) {
				reply.status(404).send({ error: "Room not found" });
				return;
			}
			reply.send(room);
		} catch (error) {
			reply.status(500).send({ error: "Internal server error" });
		}
	});
}