/**
 * Configuration CORS pour Fastify et Socket.IO
 */
export function getAllowedOrigins(): string[] {
	return process.env.FRONTEND_URL 
		? process.env.FRONTEND_URL.split(',').map(url => url.trim())
		: ["http://localhost:3001", "http://localhost:5173"];
}

export function getCorsOptions() {
	return {
		origin: getAllowedOrigins(),
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		exposedHeaders: ["Set-Cookie"],
	};
}

export function getSocketIOCorsOptions() {
	return {
		origin: getAllowedOrigins(),
		credentials: true,
	};
}






