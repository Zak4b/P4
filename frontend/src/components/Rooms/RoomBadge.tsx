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

	const getClass = (status: Room["status"]) => {
		switch (status) {
			case "waiting":
				return "bg-warning";
			case "playing":
				return "bg-success";
			case "finished":
				return "bg-secondary";
			default:
				return "bg-secondary";
		}
	};

	return <span className={`mb-1 badge ${getClass(status)}`}>{getText(status)}</span>;
};

export default GameBadge;
