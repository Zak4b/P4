import express from "express";
import { auth } from "../midleware.js";
import { listAllRooms } from "../actions/rooms.js";
import { loginRouter } from "./login.js";
export const router = express();
router.use(express.static("public"));
router.use("/login", loginRouter);
router.use(auth("login"));
router.get("/", async (req, res, next) => {
    res.render("index.ejs");
});
router.get("/rooms", async (req, res, next) => {
    res.json(listAllRooms());
});
