import { create, meta, schema } from "@dicebear/micah";
import { BACKEND_URL } from "@/lib/api";

export const micahStyle = { create, meta, schema };

export function getAvatarUrl(userId: string | null | undefined): string | undefined {
	if (!userId) {
		return undefined;
	}
	return `${BACKEND_URL}/api/avatars/${userId}`;
}
