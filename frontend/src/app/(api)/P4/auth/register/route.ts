import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import auth from "@/services/auth.service";
import { registerSchema } from "@/lib/zod-schemas";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		
		// Validation
		const validationResult = registerSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: validationResult.error.issues },
				{ status: 400 }
			);
		}

		const { login, email, password } = validationResult.data;

		const result = await auth.register(login, email, password);

		// Définir le cookie
		const cookieStore = await cookies();
		cookieStore.set(auth.cookieName, result.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
		});

		return NextResponse.json(
			{
				success: true,
				message: "Registration successful",
				user: result.user,
			},
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === "Email already exists") {
				return NextResponse.json({ error: error.message }, { status: 409 });
			}
		}
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}