import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/user.service.js";
import { HttpError } from "../lib/HttpError.js";

export function userRoutes(fastify: FastifyInstance) {
	fastify.get("/", async (_, reply: FastifyReply) => {
		const users = await UserService.listAll();
		reply.send(users);
	});

	// Routes statiques avant les paramétriques pour éviter les conflits
	fastify.get("/leaderboard", async (_, reply: FastifyReply) => {
		const leaderboard = await UserService.getLeaderboard(10);
		reply.send(leaderboard);
	});

	// Profil complet d'un joueur (id ou login)
	fastify.get(
		"/profile/:identifier",
		async (request: FastifyRequest<{ Params: { identifier: string } }>, reply: FastifyReply) => {
			const { identifier } = request.params;
			const profile = await UserService.getProfile(identifier);
			if (!profile) {
				throw HttpError.notFound("User not found");
			}
			reply.send(profile);
		}
	);

	// Informations de base (id ou login) - sans mot de passe
	fastify.get("/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		const user = await UserService.getByIdOrLogin(id);
		if (!user) {
			throw HttpError.notFound("User not found");
		}
		const { password: _p, ...safeUser } = user;
		reply.send(safeUser);
	});

	// Statistiques (id ou login)
	fastify.get("/:id/stats", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		const { id } = request.params;
		const user = await UserService.getByIdOrLogin(id);
		if (!user) {
			throw HttpError.notFound("User not found");
		}
		const stats = await UserService.getStats(user.id);
		if (!stats) {
			throw HttpError.notFound("User not found");
		}
		reply.send(stats);
	});
}

