import { prisma } from "../lib/prisma.js";
import { hash, compare } from "bcrypt";

// Récupérer un utilisateur par son ID
const getById = async (id: string) => {
	return await prisma.user.findUnique({
		where: { id },
	});
};

// Créer un utilisateur complet
const create = async (login: string, email: string, passwordPlain: string) => {
	const password = await hash(passwordPlain, 10);
	const user = await prisma.user.create({
		data: {
			login,
			email,
			password,
		},
	});
	return user.id;
};

const findByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: { email },
	});
};

const verifyCredentials = async (email: string, passwordPlain: string) => {
	const user = await findByEmail(email);
	if (!user) return null;

	const isValid = await compare(passwordPlain, user.password);
	if (!isValid) return null;

	return user;
};

const listAll = async () => {
	return await prisma.user.findMany({
		select: {
			id: true,
			login: true,
			email: true,
			createdAt: true,
		},
	});
};

const update = async (id: string, data: any) => {
	return await prisma.user.update({
		where: { id },
		data,
	});
};

export default { getById, create, findByEmail, verifyCredentials, listAll, update };
