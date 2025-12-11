import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { generateAvatar } from "@/lib/avatar";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const svg = generateAvatar(id, "micah");
		return new NextResponse(svg, {
			headers: {
				"Content-Type": "image/svg+xml",
			},
		});
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}