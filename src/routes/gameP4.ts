import express from "express";
import { auth } from "../midleware.js";
import rooms from "../actions/rooms.js";
import game from "../actions/game.js";

import { loginRouter } from "./login.js";
export const router = express();
router.use(express.static("public"));

router.use("/login", loginRouter);

router.use(auth("login"));
router.get("/", async (req, res, next) => {
	res.render("index.ejs");
});
router.get("/rooms", async (req, res, next) => {
	res.json(rooms.listAll());
});
router.get("/history", async (req, res, next) => {
	res.json(game.history());
});
router.get("/score", async (req, res, next) => {
	res.json(game.playerScore());
});
