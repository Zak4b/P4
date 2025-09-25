import React, { useEffect, useState } from "react";
import { apiClient } from "../api";

interface GameHistory {
	id: string;
	name_1: string;
	name_2: string;
	player_1: number;
	player_2: number;
	result: number;
	time: number;
}

const HistoryPage: React.FC = () => {
	const [history, setHistory] = useState<GameHistory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		apiClient
			.getHistory()
			.then(setHistory)
			.catch(() => setError("error"))
			.finally(() => setIsLoading(false));
	}, []);

	const formatDate = (dateStr: string | number) => {
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
				<button className="btn btn-outline-danger">Retry</button>
			</div>
		);
	}

	return (
		<div className="history-page">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1>Game History</h1>
				<button className="btn btn-outline-primary">
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
								<th>Players</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{history.map((game) => (
								<tr key={game.id}>
									<td>
										<span className={`badge bg-${game.result == 1 ? "success" : "danger"} me-1`}>{game.name_1}</span>
										<span className={`badge bg-${game.result == 2 ? "success" : "danger"} me-1`}>{game.name_2}</span>
									</td>
									<td>
										<small className="text-muted">{formatDate(game.time)}</small>
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
