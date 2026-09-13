"use client";

import { Badge, type BadgeVariant } from "@/components/ui";
import type { Room } from "@p4/schemas/room";

const GameBadge: React.FC<{ status: Room["status"] }> = ({ status }) => {
	const getText = (value: Room["status"]) => {
		switch (value) {
			case "idle":
				return "En attente";
			case "playing":
				return "En cours";
			default:
				return "Inconnu";
		}
	};

	const getVariant = (value: Room["status"]): BadgeVariant => {
		switch (value) {
			case "idle":
				return "warning";
			case "playing":
				return "success";
			default:
				return "outline";
		}
	};

	return <Badge variant={getVariant(status)}>{getText(status)}</Badge>;
};

export default GameBadge;
