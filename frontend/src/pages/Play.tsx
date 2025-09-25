import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameCanvas from "../components/GameCanvas";
import MessageArea from "../components/MessageArea";
import { gameInterface } from "../indexScript";

const GamePage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const [playerStates, setPlayerStates] = useState({
		player1: { active: false, name: "Joueur #1" },
		player2: { active: false, name: "Joueur #2" },
	});

	const roomId = searchParams.get("roomId") || "1";

	const handlePlayerStateChange = (playerNumber: number, active: boolean) => {
		console.log(`Player ${playerNumber} is now ${active ? "active" : "inactive"}`);
		setPlayerStates((prev) => {
			const a = {
				...prev,
				[`player${playerNumber}`]: {
					...prev[`player${playerNumber}` as keyof typeof prev],
					active,
				},
			};
			return a;
		});
	};

	return (
		<div className="row">
			<div className="col-lg-7 col-12">
				<GameCanvas canvas_i={gameInterface} setActivePlayer={handlePlayerStateChange} />
				<div className="container-fluid d-flex justify-content-evenly bg-dark p-2 rounded-4 mt-3">
					<div className={`btn  ${playerStates.player1.active ? "btn-danger" : "btn-outline-danger disabled"}`}>{playerStates.player1.name}</div>
					<div className={`btn  ${playerStates.player2.active ? "btn-warning" : "btn-outline-warning disabled"}`}>{playerStates.player2.name}</div>
				</div>
			</div>
			<div className="col-lg-5 col-12 d-flex flex-column">
				<MessageArea roomId={roomId} />
			</div>
		</div>
	);
};

export default GamePage;
