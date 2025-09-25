import React, { useState } from "react";
import { apiClient } from "../api";
import { useAuth } from "./AuthContext";
import Button from "./Elements/Button";

interface LoginFormProps {
	onLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username.trim()) return;

		setIsLoading(true);
		setError("");

		try {
			await login(username);
			onLogin?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="row justify-content-center">
			<div className="col-md-6 col-lg-4">
				<div className="card">
					<div className="card-header">
						<h5 className="card-title mb-0">Login to P4 Game</h5>
					</div>
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="username" className="form-label">
									Username
								</label>
								<input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
							</div>
							<Button type="submit" variant="primary" className="w-100" disabled={isLoading || !username.trim()}>
								{isLoading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status"></span>
										Logging in...
									</>
								) : (
									"Login"
								)}
							</Button>
						</form>
						{error && <div className="alert alert-danger mt-3">{error}</div>}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
