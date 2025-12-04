import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import auth from "../services/auth.js";
import { z } from "zod";
import { registerSchema, loginSchema } from "../lib/zod-schemas.js";

export async function loginRoutes(fastify: FastifyInstance) {
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
		async (request: FastifyRequest<{ Body: { name: string; email: string; password: string } }>, reply: FastifyReply) => {
			try {
				const { name, email, password } = request.body;

				const result = await auth.register(name, email, password);

				reply.setCookie(auth.cookieName, result.token, {
					signed: false, // Non signé car le JWT est déjà signé
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
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
		"/",
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
					secure: process.env.NODE_ENV === "production",
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

	// Connexion simple (rétrocompatibilité)
	fastify.post("/simple", async (request: FastifyRequest<{ Body: { username?: string } }>, reply: FastifyReply) => {
		const data = request.body;
		if (typeof data.username === "string") {
			try {
				const result = await auth.loggin(data.username.trim());
				// Convertir l'objet en JSON string pour le cookie
				reply.setCookie(auth.cookieName, JSON.stringify(result.cookieContent), { signed: true });
				reply.status(200).send({ success: true, message: "Login successful" });
			} catch {
				reply.status(401).send({ error: "Invalid username or password" });
			}
		} else {
			reply.status(400).send({ error: "Username is required" });
		}
	});

	// Statut de connexion
	fastify.get("/status", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			// Les cookies ne sont plus signés, Fastify les met directement dans request.cookies
			const Req = {
				signedCookies: request.cookies || {},
				cookies: request.cookies || {},
				headers: request.headers,
			} as any;

			const expressLikeRes = {
				status: (code: number) => ({
					json: (data: any) => reply.status(code).send(data),
				}),
			} as any;

			const isLogged = auth.isLogged(Req, expressLikeRes);
			const userPayload = auth.getUserFromRequest(Req);

			reply.send({
				isLoggedIn: isLogged,
				user: userPayload
					? {
							id: userPayload.userId,
							name: userPayload.name,
							email: userPayload.email,
					  }
					: null,
			});
		} catch (error) {
			fastify.log.error(error);
			reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Déconnexion
	fastify.post("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.clearCookie(auth.cookieName, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});
		reply.send({ success: true, message: "Logout successful" });
	});
}
