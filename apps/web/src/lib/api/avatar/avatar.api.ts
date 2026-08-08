import { BACKEND_URL } from "../api_client";

export class AvatarApi {
	static url(userId: string | null | undefined): string | undefined {
		if (!userId) {
			return undefined;
		}
		return `${BACKEND_URL}/api/avatars/${userId}`;
	}
}
