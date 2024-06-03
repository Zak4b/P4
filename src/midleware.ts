import authM from "./actions/auth.js";

export const auth = (redirect: string) => {
	return (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
		if (authM.isLogged(req, res)) {
			next();
		} else {
			res.redirect(redirect);
			return;
		}
	};
};
