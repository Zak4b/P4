import { prisma } from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../lib/password.js";
import { v4 as uuidv4 } from "uuid";

// Créer un nouvel utilisateur avec email et mot de passe
const create = async (name: string, email: string, password: string, uuid: string | null = null): Promise<number> => {
	const hashedPassword = await hashPassword(password);
	
	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	if (user.id && uuid) {
		await prisma.token.create({
			data: {
				uuid,
				userId: user.id,
			},
		});
	}
	return user.id;
};

// Créer un utilisateur avec seulement un nom (pour rétrocompatibilité)
const createSimple = async (name: string, uuid: string | null = null): Promise<number> => {
	const user = await prisma.user.create({
		data: {
			name,
			email: `${name}_${Date.now()}@temp.local`, // Email temporaire unique
			password: await hashPassword(uuidv4()), // Password aléatoire
		},
	});

	if (user.id && uuid) {
		await prisma.token.create({
			data: {
				uuid,
				userId: user.id,
			},
		});
	}
	return user.id;
};

// Trouver un utilisateur par email
const findByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: { email },
	});
};

// Vérifier les identifiants
const verifyCredentials = async (email: string, password: string) => {
	const user = await findByEmail(email);
	if (!user || !user.password) {
		return null;
	}
	
	const isValid = await comparePassword(password, user.password);
	if (!isValid) {
		return null;
	}
	
	return user;
};

// Obtenir un utilisateur par UUID ou email (pour rétrocompatibilité)
const get = async (identifier: string): Promise<number> => {
	// Si c'est un email (contient @), chercher par email
	if (identifier.includes("@")) {
		const userData = await findByEmail(identifier);
		if (userData) {
			return userData.id;
		}
		throw new Error("User not found");
	}
	
	// Sinon, chercher par UUID dans la table Token (rétrocompatibilité)
	const token = await prisma.token.findUnique({
		where: { uuid: identifier },
		include: { user: true },
	});

	if (token?.userId) {
		return token.userId;
	} else {
		throw new Error("User not found");
	}
};

// Obtenir un utilisateur par ID
const getById = async (id: number) => {
	return await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			email: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

const listAll = async () => {
	return await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

const merge = async (id1: number, id2: number) => {
	await prisma.$transaction([
		prisma.token.updateMany({
			where: { userId: id2 },
			data: { userId: id1 },
		}),
		prisma.game.updateMany({
			where: { player1: id2 },
			data: { player1: id1 },
		}),
		prisma.game.updateMany({
			where: { player2: id2 },
			data: { player2: id1 },
		}),
		prisma.user.delete({
			where: { id: id2 },
		}),
	]);
};

export default { create, createSimple, findByEmail, verifyCredentials, get, getById, listAll, merge };
