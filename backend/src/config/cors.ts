/**
 * Configuration CORS pour Fastify et Socket.IO
 */
export function getCorsOptions() {
	return {
		origin: true,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		exposedHeaders: ["Set-Cookie"],
	};
}

export function getSocketIOCorsOptions() {
	return {
		origin: true, // Autorise toutes les origines
		credentials: true,
	};
}






