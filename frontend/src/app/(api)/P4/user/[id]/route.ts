import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { UserService } from "@/services/user.service";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const authError = await requireAuth(req);
	if (authError) return authError;

	try {
		const { id } = await params;
		const user = await UserService.getByLogin(id);
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}