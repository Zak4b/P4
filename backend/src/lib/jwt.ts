import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JWTPayload {
	id: string;
	email: string;
	login: string;
}

export const generateToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, env.jwt.secret, {
		expiresIn: env.jwt.expiresIn,
	} as SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
	try {
		const cleanToken = token.trim().replace(/\s+/g, "");
		return jwt.verify(cleanToken, env.jwt.secret) as JWTPayload;
	} catch {
		throw new Error("Invalid or expired token");
	}
};
