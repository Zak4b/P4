import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import auth from "@/services/auth.service";

export async function GET(req: NextRequest) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get(auth.cookieName)?.value;
		
		const authRequest = {
			cookies: token ? { [auth.cookieName]: token } : {},
			headers: Object.fromEntries(req.headers.entries()),
		};

		const user = auth.getUserFromRequest(authRequest);

		return NextResponse.json({
			isLoggedIn: !!user,
			user: user ?? null,
		});
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}