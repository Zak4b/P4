import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import auth from "../services/auth.service.js";
import { z } from "zod";
import { registerSchema, loginSchema } from "../lib/zod-schemas.js";

const SECURE = process.env.NODE_ENV === "production"

export async function authRoutes(fastify: FastifyInstance) {
	// Validation helper
	const validateBody = (schema: z.ZodSchema) => {
		return async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
			try {
				schema.parse(request.body);
			} catch (error) {
				if (error instanceof z.ZodError) {
					reply.status(400).send({ error: "Invalid request data", details: error.issues });
				} else {
					reply.status(400).send({ error: "Validation error" });
				}
			}
		};
	};

	// Inscription
	fastify.post(
		"/register",
		{
			preValidation: validateBody(registerSchema),
		},
		async (request: FastifyRequest<{ Body: { login: string; email: string; password: string } }>, reply: FastifyReply) => {
			try {
				const { login, email, password } = request.body;

				const result = await auth.register(login, email, password);

				reply.setCookie(auth.cookieName, result.token, {
					signed: false, // Non signé car le JWT est déjà signé
					httpOnly: true,
					secure: false, //process.env.NODE_ENV === "production",
					sameSite: "none",
					path: "/",
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
				});

				reply.status(201).send({
					success: true,
					message: "Registration successful",
					user: result.user,
				});
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Email already exists") {
						reply.status(409).send({ error: error.message });
						return;
					}
				}
				reply.status(500).send({ error: "Internal server error" });
			}
		}
	);

	// Connexion
	fastify.post(
		"/login",
		{
			preValidation: validateBody(loginSchema),
		},
		async (request: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) => {
			try {
				const { email, password } = request.body;

				const result = await auth.login(email, password);

				reply.setCookie(auth.cookieName, result.token, {
					signed: false,
					httpOnly: true,
					secure: SECURE,
					sameSite: "lax",
					path: "/",
					maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
				});

				reply.status(200).send({
					success: true,
					message: "Login successful",
					user: result.user,
				});
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "Invalid email or password") {
						reply.status(401).send({ error: error.message });
						return;
					}
				}
				reply.status(500).send({ error: "Internal server error" });
			}
		}
	);

	// Statut de connexion
	fastify.get("/status", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			reply.send({
				isLoggedIn: request.user ? true : false,
				user: request.user ?? null,
			});
		} catch (error) {
			fastify.log.error(error);
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Déconnexion
	fastify.post(
		"/logout",
		{
			schema: {
				body: {}, // Schema vide pour permettre un body vide
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			reply.clearCookie(auth.cookieName, {
				httpOnly: true,
				secure: SECURE,
				sameSite: "lax",
				path: "/",
			});
			reply.send({ success: true, message: "Logout successful" });
		}
	);
}
