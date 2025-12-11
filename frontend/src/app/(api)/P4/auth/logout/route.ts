import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import auth from "@/services/auth.service";

export async function POST() {
	const cookieStore = await cookies();
	cookieStore.delete(auth.cookieName);
	
	return NextResponse.json({ success: true, message: "Logout successful" });
}