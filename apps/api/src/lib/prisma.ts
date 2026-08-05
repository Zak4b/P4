import { PrismaClient } from "@prisma/client";
import { ENV } from "../config/env.js";

const prismaClientSingleton = () => {
	return new PrismaClient({
		log: ENV.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
	});
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (ENV.nodeEnv !== "production") globalThis.prisma = prisma;
