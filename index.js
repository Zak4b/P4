import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import expressWs from "express-ws";
import { websocketConnection } from "./src/websocket.js";
import { router } from "./src/routes/gameP4.js";

const app = express();
expressWs(app);
app.set("view engine", "ejs");
app.use(cookieParser("shhhhh"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.ws("/P4", async function (ws, req) {
	websocketConnection(ws, req);
});
app.use("/P4", router);

//Error Handling
app.use(async (req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
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

app.listen(process.env.PORT, process.env.IP, () => {
	console.log(`Server running ${process.env.IP}:${process.env.PORT}`);
});
