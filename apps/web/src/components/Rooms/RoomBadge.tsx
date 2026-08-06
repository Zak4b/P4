"use client";

import { Chip } from "@mui/material";
import type { Room } from "@p4/schemas/room";

const GameBadge: React.FC<{ status: Room["status"] }> = ({ status }) => {
	const getText = (status: Room["status"]) => {
		switch (status) {
			case "idle":
				return "En attente";
			case "playing":
				return "En cours";
		}
	};

	const getColor = (status: Room["status"]): "warning" | "success" | "default" | "info" => {
		switch (status) {
			case "idle":
				return "warning";
			case "playing":
				return "success";
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
