import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { ENV } from "../config/env.js";

const prismaClientSingleton = () => {
	const adapter = new PrismaMariaDb({
		host: ENV.db.host,
		port: ENV.db.port,
		user: ENV.db.user,
		password: ENV.db.password,
		database: ENV.db.database,
		connectionLimit: 5,
	});

	return new PrismaClient({
		adapter,
		log: ENV.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
	});
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (ENV.nodeEnv !== "production") globalThis.prisma = prisma;
