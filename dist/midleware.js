import { isLogged } from "./actions/auth.js";
/**
 * @param {string} redirect
 * @returns
 */
export const auth = (redirect) => {
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {import('express').NextFunction} next
	 * */
	return (req, res, next) => {
		if (isLogged(req)) {
			next();
		} else {
			res.redirect(redirect);
			return;
		}
	};
};
