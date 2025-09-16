import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import expressWs from "express-ws";
import cors from "cors";
import { websocketConnection } from "./websocket.js";
import { router } from "./routes/gameP4.js";

const app = express();
const expressWsInstance = expressWs(app);
const wsApp = expressWsInstance.app;

// CORS configuration for frontend
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:5173",
		credentials: true,
	})
);

app.use(cookieParser("shhhhh"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket endpoint
wsApp.ws("/P4", async function (ws, req) {
	websocketConnection(ws, req);
});

// API routes
app.use("/P4", router);

//Error Handling
app.use(async (req, res, next) => {
	const err = new Error("Not Found") as Error & { status?: number };
	err.status = 404;
	next(err);
});

import { Request, Response, NextFunction } from "express";

app.use(async (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
	if (err.status === 404) {
		console.error("API endpoint not found", req.url);
		res.status(404).json({ error: "API endpoint not found" });
	} else {
		console.error(err.stack);
		res.status(500).json({ error: "Internal server error" });
	}
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const IP = process.env.IP || "localhost";

app.listen(PORT, IP, () => {
	console.log(`Backend API server running on ${IP}:${PORT}`);
});
