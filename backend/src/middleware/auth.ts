import { FastifyRequest, FastifyReply } from "fastify";
import { unsign } from "cookie-signature";
import authM from "../services/auth.js";
import { env } from "../config/env.js";
import { toAuthRequest } from "../lib/auth-utils.js";

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
	let unsignedToken: string | null = null;

	// Parser les cookies depuis le header pour obtenir la valeur brute
	const cookieHeader = request.headers.cookie || "";
	if (cookieHeader) {
		const cookies = cookieHeader.split(";").reduce((acc: { [key: string]: string }, cookie) => {
			const [key, value] = cookie.trim().split("=");
			if (key && value) {
				acc[key] = decodeURIComponent(value);
			}
			return acc;
		}, {});

		// Essayer d'abord avec Fastify's unsignCookie si disponible
		if (cookies.token && typeof (request as any).unsignCookie === "function") {
			try {
				const unsigned = (request as any).unsignCookie(cookies.token);
				if (unsigned && unsigned.valid) {
					unsignedToken = unsigned.value;
				}
			} catch (e) {
				// Si unsignCookie échoue, continuer avec la désignature manuelle
			}
		}

		// Si unsignCookie n'a pas fonctionné, essayer de désigner manuellement
		if (!unsignedToken && cookies.token) {
			if (cookies.token.startsWith("s:")) {
				// Cookie signé - extraire la valeur
				const unsigned = unsign(cookies.token.slice(2), env.jwt.secret);
				if (unsigned !== false) {
					unsignedToken = unsigned;
				}
			} else {
				// Cookie non signé ou JWT direct
				unsignedToken = cookies.token;
			}
		}
	}

	// Si toujours pas de token, vérifier request.cookies (peut être déjà désigné)
	if (!unsignedToken && request.cookies && request.cookies.token) {
		const tokenValue = request.cookies.token;
		if (typeof tokenValue === "string") {
			if (tokenValue.startsWith("s:")) {
				// Cookie signé dans request.cookies - désigner manuellement
				const unsigned = unsign(tokenValue.slice(2), env.jwt.secret);
				if (unsigned !== false) {
					unsignedToken = unsigned;
				}
			} else {
				// Déjà désigné
				unsignedToken = tokenValue;
			}
		}
	}

	const authRequest = toAuthRequest(request);
	if (authM.isLogged(authRequest)) {
		return;
	} else {
		reply.status(401).send({ error: "Authentication required" });
	}
};
