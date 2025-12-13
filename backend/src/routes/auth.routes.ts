import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import auth from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../lib/zod-schemas.js";
import { HttpError } from "../lib/HttpError.js";

const COOKIE_OPTS = {
	signed: false,
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/",
} as const;

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 jours

export function authRoutes(fastify: FastifyInstance) {
	// Inscription
	fastify.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const { login, email, password } = registerSchema.parse(request.body);

				const result = await auth.register(login, email, password);

				reply.status(201).send({
					success: true,
					message: "Registration successful",
					user: result.user,
				});
			} catch (error) {
				if (error instanceof Error && error.message === "Email already exists") {
					throw HttpError.conflict(error.message);
				}
				throw error;
			}
		}
	);

	// Connexion
	fastify.post("/login",async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { email, password } = loginSchema.parse(request.body);

			const result = await auth.login(email, password);

			reply.setCookie(auth.cookieName, result.token, {
				...COOKIE_OPTS,
				maxAge: COOKIE_MAX_AGE,
			});

			reply.status(200).send({
				success: true,
				message: "Login successful",
			});
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "Invalid email or password") {
					throw HttpError.unauthorized(error.message);
				}
			}
			throw error;
		}
	});

	// Statut de connexion
	fastify.get("/status", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.send({
			isLoggedIn: request.user ? true : false,
			user: request.user ?? null,
		});
	});

	// Déconnexion
	fastify.post("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.clearCookie(auth.cookieName, COOKIE_OPTS);
		reply.send({ success: true, message: "Logout successful" });
	});
}
