import { Chip } from "@mui/material";
import { Room } from "../../api";

const GameBadge: React.FC<{ status: Room["status"] }> = ({ status }) => {
	const getText = (status: Room["status"]) => {
		switch (status) {
			case "waiting":
				return "En attente";
			case "playing":
				return "En cours";
			case "finished":
				return "Terminée";
			default:
				return "Inconnu";
		}
	};

	const getColor = (status: Room["status"]): "warning" | "success" | "default" | "info" => {
		switch (status) {
			case "waiting":
				return "warning";
			case "playing":
				return "success";
			case "finished":
				return "default";
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
