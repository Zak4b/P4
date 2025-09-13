import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import expressWs from "express-ws";
import cors from "cors";
import { websocketConnection } from "./dist/websocket.js";
import { router } from "./dist/routes/gameP4.js";

const app = express();
const expressWsInstance = expressWs(app);

// CORS configuration for frontend
app.use(cors({
	origin: process.env.FRONTEND_URL || "http://localhost:5173",
	credentials: true
}));

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(cookieParser("shhhhh"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for development (when frontend is not built)
app.use(express.static('public'));

// WebSocket endpoint
app.ws("/P4", async function (ws, req) {
	websocketConnection(ws, req);
});

// API routes
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

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || "localhost";

app.listen(PORT, IP, () => {
	console.log(`Backend server running on ${IP}:${PORT}`);
});
