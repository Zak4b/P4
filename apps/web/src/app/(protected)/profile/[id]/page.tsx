"use client";

import { useParams } from "next/navigation";
import ProfilePage from "@/components/profile/ProfilePage";

export default function Page() {
	const params = useParams();
	const id = (params?.id as string) ?? "";

	return <ProfilePage userId={id} />;
}
