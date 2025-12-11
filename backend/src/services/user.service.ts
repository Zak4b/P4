import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/password.js";

export namespace UserService {
	export const getById = async (id: string) => {
		return await prisma.user.findUnique({
			where: { id },
		});
	};

	export const getByLogin = async (login: string) => {
		return await prisma.user.findUnique({
			where: { login },
		});
	};
		
	export const getByEmail = async (email: string) => {
		return await prisma.user.findUnique({
			where: { email },
		});
	};

	export const getStats = async (id: string) => {
		return await prisma.user.findUnique({
			where: { id },
			select: {
				eloRating: true,
			},
		});
	};
	
	export const create = async (login: string, email: string, passwordPlain: string) => {
		const password = await hashPassword(passwordPlain);
		const user = await prisma.user.create({
			data: {
				login,
				email,
				password,
			},
		});
		return user;
	};
	
	export const verifyCredentials = async (email: string, passwordPlain: string) => {
		const user = await getByEmail(email);
		if (!user) return null;
	
		const isValid = await comparePassword(passwordPlain, user.password);
		if (!isValid) return null;
	
		return user;
	};
	
	export const listAll = async () => {
		return await prisma.user.findMany({
			select: {
				login: true,
				eloRating: true,
			},
		});
	};
	
	export const update = async (id: string, data: any) => {
		return await prisma.user.update({
			where: { id },
			data,
		});
	};
}
