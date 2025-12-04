import express from "express";
import auth from "../actions/auth.js";
import { z } from "zod";
import { registerSchema, loginSchema } from "../lib/zod-schemas.js";

export const loginRouter = express.Router();

// Validation middleware
const validate = (schema: z.ZodSchema) => {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ error: "Invalid request data", details: error.issues });
				return;
			}
			next(error);
		}
	};
};

// Inscription
loginRouter.post("/register", validate(registerSchema), async (req, res, next) => {
	try {
		const { name, email, password } = req.body;
		
		const result = await auth.register(name, email, password);
		
		// Définir le cookie avec le token JWT
		res.cookie(auth.cookieName, result.token, {
			signed: true,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
		});
		
		res.status(201).json({
			success: true,
			message: "Registration successful",
			user: result.user,
		});
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "Email already exists") {
				res.status(409).json({ error: error.message });
				return;
			}
		}
		next(error);
	}
});

// Connexion
loginRouter.post("/", validate(loginSchema), async (req, res, next) => {
	try {
		const { email, password } = req.body;
		
		const result = await auth.login(email, password);
		
		// Définir le cookie avec le token JWT
		res.cookie(auth.cookieName, result.token, {
			signed: true,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
		});
		
		res.status(200).json({
			success: true,
			message: "Login successful",
			user: result.user,
		});
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "Invalid email or password") {
				res.status(401).json({ error: error.message });
				return;
			}
		}
		next(error);
	}
});

// Connexion simple (rétrocompatibilité)
loginRouter.post("/simple", async (req, res, next) => {
	const data = req.body;
	if (typeof data.username === "string") {
		auth.loggin(data.username.trim())
			.then((result) => {
				res.cookie(auth.cookieName, result.cookieContent, { signed: true });
				res.status(200).json({ success: true, message: "Login successful" });
			})
			.catch(() => {
				res.status(401).json({ error: "Invalid username or password" });
			});
	} else {
		res.status(400).json({ error: "Username is required" });
	}
});

// Statut de connexion
loginRouter.get("/status", async (req, res, next) => {
	try {
		const isLogged = auth.isLogged(req, res);
		const userPayload = auth.getUserFromRequest(req);
		
		res.json({
			isLoggedIn: isLogged,
			user: userPayload ? {
				id: userPayload.userId,
				name: userPayload.name,
				email: userPayload.email,
			} : null,
		});
	} catch (error) {
		next(error);
	}
});

// Déconnexion
loginRouter.post("/logout", async (req, res, next) => {
	res.clearCookie(auth.cookieName, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
	res.json({ success: true, message: "Logout successful" });
});
