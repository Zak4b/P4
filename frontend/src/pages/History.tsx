import React, { useEffect, useState } from "react";
import { apiClient } from "../api";

interface GameHistory {
	id: string;
	roomId: string;
	winner: string | null;
	players: string[];
	createdAt: string;
	duration?: number;
}

const HistoryPage: React.FC = () => {
	const [history, setHistory] = useState<GameHistory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		loadHistory();
	}, []);

	const loadHistory = async () => {
		try {
			setIsLoading(true);
			// This would need to be implemented in the API
			// const response = await apiClient.getGameHistory()
			// setHistory(response.data || [])

			// For now, show mock data
			setHistory([
				{
					id: "1",
					roomId: "room1",
					winner: "Player1",
					players: ["Player1", "Player2"],
					createdAt: "2024-01-15T10:30:00Z",
					duration: 300,
				},
				{
					id: "2",
					roomId: "room2",
					winner: "Player2",
					players: ["Player1", "Player2"],
					createdAt: "2024-01-15T09:15:00Z",
					duration: 450,
				},
			]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load history");
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleString(undefined, {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	if (isLoading) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
				<div className="spinner-border" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="alert alert-danger" role="alert">
				<h4 className="alert-heading">Erreur</h4>
				<p>{error}</p>
				<button className="btn btn-outline-danger" onClick={loadHistory}>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="history-page">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Game History</h1>
				<button className="btn btn-outline-primary" onClick={loadHistory}>
					<i className="bi bi-arrow-clockwise me-2"></i>
					Refresh
				</button>
			</div>

			{history.length === 0 ? (
				<div className="text-center py-5">
					<h3 className="text-muted">No games played yet</h3>
					<p className="text-muted">Start a game to see your history here!</p>
				</div>
			) : (
				<div className="table-responsive">
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th>Room ID</th>
								<th>Players</th>
								<th>Winner</th>
								<th>Duration</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{history.map((game) => (
								<tr key={game.id}>
									<td>
										<span className="badge bg-secondary">{game.roomId}</span>
									</td>
									<td>
										{game.players.map((player, index) => (
											<span key={index} className="badge bg-info me-1">
												{player}
											</span>
										))}
									</td>
									<td>{game.winner ? <span className="badge bg-success">{game.winner}</span> : <span className="text-muted">Ongoing</span>}</td>
									<td>{game.duration ? formatDuration(game.duration) : "-"}</td>
									<td>
										<small className="text-muted">{formatDate(game.createdAt)}</small>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default HistoryPage;
