import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { RoomService } from "../services/room.service.js";
import { z } from "zod";
import { HttpError } from "../lib/HttpError.js";

export function roomRoutes(fastify: FastifyInstance) {

	fastify.get("/", async (_, reply: FastifyReply) => {
		const rooms = RoomService.listAll();
		reply.send(rooms);
	});

	fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
		const {name} = z.object({ name: z.string().max(20).optional() }).parse(request.body);
		//const userId = request.user?.id; // TODO add user id to room
		const room = RoomService.create(name);
		reply.send({success: true, roomId: room.id});
	});

	fastify.get("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		const room = RoomService.get(id);
		if (!room) {
			throw HttpError.notFound("Room not found");
		}
		reply.send(room);
	});
}