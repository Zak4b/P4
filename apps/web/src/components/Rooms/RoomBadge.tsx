"use client";

import { Chip } from "@mui/material";
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

	const getColor = (value: Room["status"]): "warning" | "success" | "default" | "info" => {
		switch (value) {
			case "idle":
				return "warning";
			case "playing":
				return "success";
			default:
				return "default";
		}
	};

	return (
		<Chip
			label={getText(status)}
			color={getColor(status)}
			size="small"
			sx={{
				fontWeight: 600,
			}}
		/>
	);
};

export default GameBadge;
