import express from "express";
import { isLogged, loggin, cookieName } from "../actions/auth.js";
export const loginRouter = express.Router();
loginRouter
	.route("/")
	.all((req, res, next) => {
		if (isLogged(req)) {
			res.redirect("./");
			return;
		}
		next();
	})
	.get(async (req, res, next) => {
		res.render("auth.ejs");
	})
	.post(async (req, res, next) => {
		const data = req.body;
		if (typeof data.username === "string") {
			loggin(data.username.trim())
				.then((result) => {
					res.cookie(cookieName, result.cookieContent, { signed: true });
					res.status(200).end();
				})
				.catch(() => {
					res.status(401).json({ err: "Identifiant ou mot de passe non valide" });
				});
		} else {
			res.status(401);
		}
	});
