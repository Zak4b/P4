import express from "express";
import auth from "../actions/auth.js";
export const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
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

loginRouter.get("/status", async (req, res, next) => {
	const isLogged = auth.isLogged(req, res);
	res.json({ isLoggedIn: isLogged });
});

loginRouter.post("/logout", async (req, res, next) => {
	res.clearCookie(auth.cookieName);
	res.json({ success: true, message: "Logout successful" });
});
