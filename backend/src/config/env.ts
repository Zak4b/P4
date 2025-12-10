import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

// Exporter la configuration
export const env = {
	jwt: {
		secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	},
	server: {
		port: process.env.PORT ? Number(process.env.PORT) : 3000,
		ip: process.env.IP || "localhost",
	},
};
