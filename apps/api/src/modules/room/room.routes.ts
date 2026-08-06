import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createRoom, listAllRooms, getRoomById } from "./room.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { createRoomSchema, roomIdParamsSchema, roomSchema } from "./room.schemas.js";
import { errorResponseSchema, validationErrorResponseSchema } from "../../lib/http-schemas.js";

export const roomRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			schema: {
				response: {
					200: z.array(roomSchema),
				},
			},
		},
		async (_request, reply) => {
			const rooms = listAllRooms();
			reply.send(rooms);
		},
	);

	fastify.post(
		"/",
		{
			schema: {
				body: createRoomSchema,
				response: {
					201: roomSchema,
					400: validationErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { name, players } = request.body;
			const room = createRoom(name, players);

			// URL de la ressource créée, déduite du chemin de collection (insensible au préfixe de montage)
			const collectionPath = request.url.split("?")[0].replace(/\/$/, "");
			reply.header("Location", `${collectionPath}/${room.id}`).status(201).send(room);
		},
	);

	fastify.get(
		"/:id",
		{
			schema: {
				params: roomIdParamsSchema,
				response: {
					200: roomSchema,
					400: validationErrorResponseSchema,
					404: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const room = getRoomById(id);
			if (!room) {
				throw HttpError.notFound("Room not found");
			}
			reply.send(room);
		},
	);
};
