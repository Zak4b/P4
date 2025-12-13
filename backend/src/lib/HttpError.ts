export class HttpError extends Error {
	public readonly statusCode: number;
	public readonly message: string;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.name = "HttpError";
		
		// Maintient la pile d'appel correcte
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpError);
		}
	}

	static badRequest(message: string = "Bad Request") {
		return new HttpError(400, message);
	}

	static unauthorized(message: string = "Unauthorized") {
		return new HttpError(401, message);
	}

	static forbidden(message: string = "Forbidden") {
		return new HttpError(403, message);
	}

	static notFound(message: string = "Not Found") {
		return new HttpError(404, message);
	}

	static conflict(message: string = "Conflict") {
		return new HttpError(409, message);
	}

	static internalServerError(message: string = "Internal Server Error") {
		return new HttpError(500, message);
	}
}

