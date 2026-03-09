import http from "http";
import dotenv from "dotenv";
import { AIClient } from "./client.js";

dotenv.config();

const PORT = parseInt(process.env.PORT ?? "4000", 10);
const BACKEND_WS_URL = process.env.BACKEND_WS_URL ?? "http://localhost:3000";

// ── OpenAPI spec ──────────────────────────────────────────────────────────────
// SWAGGER UI :
const OPENAPI_SPEC = {
	openapi: "3.0.0",
	info: {
		title: "P4 AI Service",
		version: "1.0.0",
		description: "Service IA du jeu Puissance 4 — rejoint une salle et joue via minimax (alpha-beta).",
	},
	servers: [{ url: `http://localhost:${PORT}` }],
	paths: {
		"/health": {
			get: {
				summary: "Health check",
				tags: ["system"],
				responses: {
					"200": {
						description: "Service opérationnel",
						content: {
							"application/json": {
								schema: { type: "object", properties: { status: { type: "string", example: "ok" } } },
							},
						},
					},
				},
			},
		},
		"/join": {
			post: {
				summary: "Demander à l'IA de rejoindre une salle",
				description: "Le backend appelle cette route après avoir créé une salle via `POST /api/room/ai`. L'IA se connecte via WebSocket et commence à jouer.",
				tags: ["ai"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								required: ["roomId", "token"],
								properties: {
									roomId: { type: "string", description: "ID de la salle à rejoindre" },
									token: { type: "string", description: "JWT d'authentification généré par le backend pour le bot" },
								},
							},
						},
					},
				},
				responses: {
					"200": {
						description: "L'IA a initié la connexion à la salle",
						content: {
							"application/json": {
								schema: { type: "object", properties: { success: { type: "boolean", example: true } } },
							},
						},
					},
					"400": { description: "Paramètres manquants" },
					"500": { description: "Erreur interne" },
				},
			},
		},
	},
};

// ── Swagger UI HTML (CDN) ─────────────────────────────────────────────────────
const SWAGGER_UI_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>P4 AI Service — API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"/>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
      layout: 'StandaloneLayout',
      tryItOutEnabled: true,
      docExpansion: 'list',
    });
  </script>
</body>
</html>`;

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
	if (req.method === "POST" && req.url === "/join") {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			try {
				const { roomId, token, difficulty } = JSON.parse(body) as { roomId?: string; token?: string; difficulty?: string };
				if (!roomId || !token) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: "roomId and token are required" }));
					return;
				}
				type DifficultyConfig = { depth: number; temperature: number };
				const difficultyMap: Record<string, DifficultyConfig> = {
					easy:       { depth: 2, temperature: 80 },
					medium:     { depth: 4, temperature: 25 },
					hard:       { depth: 6, temperature: 8  },
					impossible: { depth: 7, temperature: 0  },
				};
				const { depth, temperature } = difficultyMap[difficulty ?? ""] ?? difficultyMap.hard;
				new AIClient(BACKEND_WS_URL, roomId, token, depth, temperature);
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ success: true }));
			} catch {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ error: "Internal server error" }));
			}
		});
	} else if (req.method === "GET" && req.url === "/health") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ status: "ok" }));
	} else if (req.method === "GET" && req.url === "/openapi.json") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(OPENAPI_SPEC));
	} else if (req.method === "GET" && (req.url === "/docs" || req.url === "/docs/")) {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(SWAGGER_UI_HTML);
	} else {
		res.writeHead(404);
		res.end();
	}
});

server.listen(PORT, () => {
	console.log(`[AI Service] Listening on port ${PORT}`);
	console.log(`[AI Service] Backend WS URL: ${BACKEND_WS_URL}`);
	console.log(`[AI Service] Swagger UI    : http://localhost:${PORT}/docs`);
});
