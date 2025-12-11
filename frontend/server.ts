import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Prépare l'instance Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(async (req, res) => {
		try {
			const parsedUrl = parse(req.url!, true);
			await handle(req, res, parsedUrl);
		} catch (err) {
			console.error("Error occurred handling", req.url, err);
			res.statusCode = 500;
			res.end("internal server error");
		}
	});

	// Initialisation de Socket.IO sur le même serveur HTTP
	const io = new Server(httpServer, {
		path: "/socket.io",
		cors: { origin: true, credentials: true },
	});

	// Exposer l'instance Socket.IO globalement pour utilisation dans les routes API
	globalThis.io = io;

	// Socket.IO connection handler
	io.on("connection", async (socket) => {		
		const cookieHeader = socket.handshake.headers.cookie || "";
		const { parse: parseCookie } = await import("cookie");
		const cookies = cookieHeader ? parseCookie(cookieHeader) : {};

		const req = {
			cookies,
			headers: socket.handshake.headers,
		};

		const { websocketConnection } = await import("./src/lib/websocket");
		websocketConnection(socket, req);
	});

	// Gérer les erreurs de connexion Socket.IO
	io.engine.on("connection_error", (err) => {
		console.error("Socket.IO connection error:", err);
	});

	httpServer.listen(port, (err?: Error) => {
		if (err) throw err;
		console.log(`> Prêt sur http://${hostname}:${port}`);
		console.log("Socket.IO initialisé sur /api/socket");
	});
});
