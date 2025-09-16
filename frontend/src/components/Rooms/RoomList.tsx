import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, Room } from "../../api";
import RoomBadge from "./RoomBadge";
import Button from "../Elements/Button";
import OffCanvas from "../Elements/OffCanvas";
import RoomForm from "./RoomForm";

interface RoomListProps {
	show: boolean;
	onHide: () => void;
}

const RoomList: React.FC<RoomListProps> = ({ show, onHide }) => {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (show) loadRooms();
	}, [show]);

	const loadRooms = async () => {
		setIsLoading(true);
		try {
			const rooms = await apiClient.getRooms();
			setRooms(rooms);
		} catch (error) {
			console.error("Failed to load rooms:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoinRoom = (roomId: string) => {
		navigate(`/?roomId=${roomId}`);
		onHide();
	};

	return (
		<OffCanvas show={show} onHide={onHide} header={<h5 className="offcanvas-title">Rooms</h5>}>
			<RoomForm onSubmit={onHide} />
			{isLoading ? (
				<div className="text-center py-3">
					<div className="spinner-border spinner-border-sm" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			) : (
				<ul className="list-group">
					{rooms.map((room) => (
						<li key={room.id} className="list-group-item d-flex justify-content-between align-items-center">
							<div className="d-flex flex-column">
								<div className="fw-bold">{room.name}</div>
								<small className="text-muted">
									{room.count}/{room.max} joueurs
								</small>
							</div>
							<div className="d-flex flex-column align-items-end">
								<RoomBadge status={room.status} />
								<Button variant="outline-primary" className="btn-sm" onClick={() => handleJoinRoom(room.id)} disabled={!room.joinable}>
									Rejoindre
								</Button>
							</div>
						</li>
					))}
				</ul>
			)}
			<Button variant="outline-secondary" className="w-100" onClick={loadRooms} disabled={isLoading}>
				Actualiser
			</Button>
		</OffCanvas>
	);
};

export default RoomList;
