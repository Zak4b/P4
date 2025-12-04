import express from "express";
import rooms from "../actions/rooms.js";
import user from "../actions/user.js";
import game from "../actions/game.js";
export const apiRouter = express.Router();

apiRouter.get("/rooms", async (req, res, next) => {
	try {
		res.json(rooms.listAll());
	} catch (error) {
		next(error);
	}
});

apiRouter.get("/users", async (req, res, next) => {
	try {
		const users = await user.listAll();
		res.json(users);
	} catch (error) {
		next(error);
	}
});

apiRouter.get("/history", async (req, res, next) => {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
		const startFrom = req.query.startFrom ? parseInt(req.query.startFrom as string) : undefined;
		const history = await game.history(limit, startFrom);
		res.json(history);
	} catch (error) {
		next(error);
	}
});

apiRouter.get("/score", async (req, res, next) => {
	try {
		const scores = await game.playerScore();
		res.json(scores);
	} catch (error) {
		next(error);
	}
});
