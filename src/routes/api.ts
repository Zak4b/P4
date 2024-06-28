import express from "express";
import rooms from "../actions/rooms.js";
import user from "../actions/user.js";
export const apiRouter = express.Router();

apiRouter.get("/rooms", async (req, res, next) => {
	res.json(rooms.listAll());
});
apiRouter.get("/users", async (req, res, next) => {
	res.json(user.listAll());
});
