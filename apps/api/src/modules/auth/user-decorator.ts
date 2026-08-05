import { FastifyRequest } from "fastify";
import { getUserFromRequest } from "./request-auth.js";

// eslint-disable-next-line @typescript-eslint/require-await
export const attachUserDecorator = async (request: FastifyRequest) => {
	const userPayload = getUserFromRequest(request);
	if (userPayload) {
		request.user = userPayload;
	}
};
