import authM from "./actions/auth.js";
import { Request, Response, NextFunction } from "express";

export const auth = () => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (authM.isLogged(req, res)) {
			next();
		} else {
			res.status(401).json({ error: "Authentication required" });
			return;
		}
	};
};

// Middleware optionnel qui attache l'utilisateur sans bloquer
export const optionalAuth = () => {
	return (req: Request, res: Response, next: NextFunction) => {
		authM.isLogged(req, res);
		next();
	};
};
