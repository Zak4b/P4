import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { UserService } from "@/services/user.service";

export async function GET(req: NextRequest) {
	const authError = await requireAuth(req);
	if (authError) return authError;

	try {
		const users = await UserService.listAll();
		return NextResponse.json(users);
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}