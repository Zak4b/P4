import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";

const app = express();
const router = express.Router();
const server = http.createServer(app);
app.set("view engine", "ejs");

router.use((req, res, next) => {
	next();
});
router.get("/", (req, res, next) => {
	res.render("index.ejs");
});
app.use("/P4", router);
app.use("/P4", express.static("public"));

server.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Server running ${process.env.IP}:${process.env.PORT}`);
});

import { wss } from "./src/websocket.js";
server.on("upgrade", (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (socket) => {
		wss.emit("connection", socket, request);
	});
});
