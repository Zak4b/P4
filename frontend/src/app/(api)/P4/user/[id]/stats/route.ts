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
		const stats = await UserService.getStats(id);
		return NextResponse.json(stats);
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}