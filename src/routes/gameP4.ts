import express from "express";
import { auth } from "../midleware.js";
import game from "../actions/game.js";

import { loginRouter } from "./login.js";
import { apiRouter } from "./api.js";
export const router = express();
router.use(express.static("public"));

router.use("/login", loginRouter);

router.use(auth("login"));
router.get("/", async (req, res, next) => {
	res.render("index.ejs");
});
router.use("/api", apiRouter);
router.get("/history", async (req, res, next) => {
	res.render("history.ejs", { hist: game.history() });
});
router.get("/score", async (req, res, next) => {
	res.json(game.playerScore());
});
