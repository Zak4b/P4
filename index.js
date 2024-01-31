import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";

const app = express();
const router = express.Router();
const server = http.createServer(app);
app.set("view engine", "ejs");
router.use(express.static("public"));
router.get("/", async (req, res, next) => {
	res.render("index.ejs");
});
app.use("/P4", router);

app.use(async (req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err), req;
});
app.use(async (err, req, res, next) => {
	if ((err.status = 404)) {
		console.error("Not Found", req.url);
		res.status(404);
		res.render("404.ejs", { err: "Not Found" });
	} else {
		console.error(err.stack);
		res.status(500);
	}
});

server.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Server running ${process.env.IP}:${process.env.PORT}`);
});

import { wss } from "./src/websocket.js";
server.on("upgrade", async (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (socket) => {
		wss.emit("connection", socket, request);
	});
});
