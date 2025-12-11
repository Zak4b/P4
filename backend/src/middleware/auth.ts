import { FastifyRequest, FastifyReply } from "fastify";

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
	if (request.user) {
		return;
	} else {
		reply.status(401).send({ error: "Authentication required" });
	}
};
