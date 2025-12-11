import { FastifyRequest, FastifyReply } from "fastify";
import authM from "../services/auth.js";
import { toAuthRequest } from "../lib/auth-utils.js";

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
	const authRequest = toAuthRequest(request);
	if (authM.isLogged(authRequest)) {
		return;
	} else {
		reply.status(401).send({ error: "Authentication required" });
	}
};
