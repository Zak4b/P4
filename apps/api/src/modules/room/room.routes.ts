import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createRoom, listAllRooms, getRoomById } from "./room.service.js";
import { HttpError } from "../../lib/HttpError.js";
import { createRoomSchema, roomIdParamsSchema, roomSchema } from "@p4/schemas/room";
import { badRequestSchema, notFoundSchema, unauthorizedSchema } from "@p4/schemas/http";
import { TAGS } from "../../config/api-tags.js";

export const roomRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"/",
		{
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "listRooms",
				tags: [TAGS.rooms],
				summary: "Lister les salons",
				response: {
					200: z.array(roomSchema),
					401: unauthorizedSchema,
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
			prefixTrailingSlash: "no-slash",
			schema: {
				operationId: "createRoom",
				tags: [TAGS.rooms],
				summary: "Créer un salon",
				description:
					"Crée le salon et y place le créateur. Rejoindre ou quitter un salon existant passe par la connexion temps réel, pas par cette API.",
				body: createRoomSchema,
				response: {
					201: roomSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const currentUser = request.user;
			if (!currentUser) {
				throw HttpError.unauthorized("Authentication required");
			}

			const { name, invited } = request.body;
			const players = [...new Set([currentUser.id, ...(invited ?? [])])];
			const room = createRoom(name, players);

			// URL de la ressource créée, déduite du chemin de collection (insensible au préfixe de montage)
			const collectionPath = (request.url.split("?")[0] ?? request.url).replace(/\/$/, "");
			reply.header("Location", `${collectionPath}/${room.id}`).status(201).send(room);
		},
	);

	fastify.get(
		"/:id",
		{
			schema: {
				operationId: "getRoom",
				tags: [TAGS.rooms],
				summary: "Récupérer un salon par son id",
				params: roomIdParamsSchema,
				response: {
					200: roomSchema,
					400: badRequestSchema,
					401: unauthorizedSchema,
					404: notFoundSchema,
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
