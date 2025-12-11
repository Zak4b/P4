import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import auth from "@/services/auth.service";

export async function getAuthUser(req: NextRequest) {
	const cookieStore = await cookies();
	const token = cookieStore.get(auth.cookieName)?.value;
	
	const authRequest = {
		cookies: token ? { [auth.cookieName]: token } : {},
		headers: Object.fromEntries(req.headers.entries()),
	};

	return auth.getUserFromRequest(authRequest);
}

export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
	const user = await getAuthUser(req);
	if (!user) {
		return NextResponse.json({ error: "Authentication required" }, { status: 401 });
	}
	return null;
}
