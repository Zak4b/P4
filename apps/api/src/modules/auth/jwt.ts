import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { ENV } from "../../config/env.js";

const jwtPayloadSchema = z.object({
	id: z.string(),
	email: z.string(),
	login: z.string(),
});

export type JWTPayload = z.infer<typeof jwtPayloadSchema>;

export const generateToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, ENV.api.jwt.secret, {
		expiresIn: ENV.api.jwt.expiresIn,
	} as SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
	const cleanToken = token.trim().replace(/\s+/g, "");

	try {
		const decoded: unknown = jwt.verify(cleanToken, ENV.api.jwt.secret);
		return jwtPayloadSchema.parse(decoded);
	} catch {
		throw new Error("Invalid or expired token");
	}
};
