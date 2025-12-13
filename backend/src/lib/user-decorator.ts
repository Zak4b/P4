import { FastifyRequest } from "fastify";
import { toAuthRequest } from "./auth-utils.js";
import auth from "../services/auth.service.js";


// eslint-disable-next-line @typescript-eslint/require-await
export const attachUserDecorator = async (request: FastifyRequest) => {
	const authRequest = toAuthRequest(request);
	const userPayload = auth.getUserFromRequest(authRequest);
	if (userPayload) {
		request.user = userPayload;
	}
};

