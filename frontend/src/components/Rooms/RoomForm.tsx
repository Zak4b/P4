import Button from "../Elements/Button";
import React, { useState } from "react";
import Input from "../Elements/Input";

interface RoomFormProps {
	onSubmit: (roomId?: string) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit }) => {
	const [name, setName] = useState("");

	const handleCreateRoom = (e: React.FormEvent) => {
		e.preventDefault();
		setName("");
		alert(`Room "${name}"`);
		onSubmit();
	};

	return (
		<form onSubmit={handleCreateRoom} className="mb-2">
			<div className="input-group">
				<Input type="text" placeholder="Nouvelle salle" value={name} onChange={(e) => setName(e.target.value)} />
				<Button variant="outline-primary" type="submit">
					Créer
				</Button>
			</div>
		</form>
	);
};

export default RoomForm;
