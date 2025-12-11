import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { GameService } from "@/services/game.service";

export async function GET(req: NextRequest) {
	const authError = await requireAuth(req);
	if (authError) return authError;

	try {
		const { searchParams } = new URL(req.url);
		const limitParam = searchParams.get("limit");
		const limit = limitParam ? parseInt(limitParam) : undefined;

		const history = await GameService.history({ limit });
		return NextResponse.json(history);
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}