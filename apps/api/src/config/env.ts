import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("production"),

	DB_HOST: z.string(),
	DB_PORT: z.coerce.number().int().positive().default(3306),
	DB_DATABASE: z.string(),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),

	PORT: z.coerce.number().int().positive().default(3000),
	HOST: z.string().default("localhost"),
	JWT_SECRET: z.string().min(1),
	JWT_EXPIRES_IN: z.string().default("7d"),
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
	WEB_URL: z.url().default("http://localhost:3001"),
	API_URL: z.url().default("http://localhost:3000"),
	SWAGGER_ENABLED: z.stringbool().optional(),
});

const { data: e, success, error } = envSchema.safeParse(process.env);

if (!success) {
	console.error("Invalid environment variables:");
	for (const [field, issues] of Object.entries(error.flatten().fieldErrors)) {
		console.error(`  ${field}: ${issues?.join(", ")}`);
	}
	process.exit(1);
}

export const ENV = {
	nodeEnv: e.NODE_ENV,
	db: {
		host: e.DB_HOST,
		port: e.DB_PORT,
		database: e.DB_DATABASE,
		user: e.DB_USER,
		password: e.DB_PASSWORD,
	},
	server: {
		port: e.PORT,
		host: e.HOST,
	},
	web: {
		url: e.WEB_URL,
	},
	api: {
		url: e.API_URL,
		docs: {
			enabled: e.SWAGGER_ENABLED ?? e.NODE_ENV !== "production",
		},
		jwt: {
			secret: e.JWT_SECRET,
			expiresIn: e.JWT_EXPIRES_IN,
		},
		oauth2: {
			google: {
				clientId: e.GOOGLE_CLIENT_ID,
				clientSecret: e.GOOGLE_CLIENT_SECRET,
			},
		},
	},
} as const;
