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
	google: {
		clientId: process.env.GOOGLE_CLIENT_ID || "",
		clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
	},
	frontend: {
		url: process.env.FRONTEND_URL || "http://localhost:3001",
	},
	backend: {
		url: process.env.BACKEND_URL || `http://localhost:${process.env.PORT ? Number(process.env.PORT) : 3000}`,
	},
};
