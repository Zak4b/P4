import { FastifyRequest, FastifyReply } from "fastify";
import { toAuthRequest } from "./auth-utils.js";
import auth from "../services/auth.service.js";


export const attachUserDecorator = async (request: FastifyRequest, reply: FastifyReply) => {
	const authRequest = toAuthRequest(request);
	const userPayload = auth.getUserFromRequest(authRequest);
	if (userPayload) {
		request.user = userPayload;
	}
};

