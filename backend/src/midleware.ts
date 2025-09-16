import authM from "./actions/auth.js";

export const auth = () => {
	return (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
		if (authM.isLogged(req, res)) {
			next();
		} else {
			res.status(401).json({ error: "Authentication required" });
			return;
		}
	};
};
