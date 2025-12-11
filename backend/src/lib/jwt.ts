import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || "your-secret-key-change-in-production") as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as string;

export interface JWTPayload {
	id: string;
	email: string;
	login: string;
}

export const generateToken = (payload: JWTPayload): string => {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	} as SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
	try {
		const cleanToken = token.trim().replace(/\s+/g, '');
		return jwt.verify(cleanToken, JWT_SECRET) as JWTPayload;
	} catch (error) {
		throw new Error("Invalid or expired token");
	}
};

