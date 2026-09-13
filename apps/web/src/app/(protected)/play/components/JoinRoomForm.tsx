"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InputAdornment, Paper, TextField } from "@mui/material";
import { Button } from "@/components/ui";
import { Search } from "@mui/icons-material";

export default function JoinRoomForm() {
	const router = useRouter();
	const [joinRoomId, setJoinRoomId] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (joinRoomId.trim()) {
			router.push(`/play/${joinRoomId.trim()}`);
		}
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit}
			elevation={0}
			sx={{
				p: 0.5,
				display: "flex",
				alignItems: "center",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 3,
			}}
		>
			<TextField
				placeholder="Enter Room ID..."
				variant="standard"
				fullWidth
				value={joinRoomId}
				onChange={(e) => setJoinRoomId(e.target.value)}
				slotProps={{
					input: {
						disableUnderline: true,
						startAdornment: (
							<InputAdornment position="start" sx={{ pl: 2 }}>
								<Search color="action" />
							</InputAdornment>
						),
					},
				}}
				sx={{ px: 1 }}
			/>
			<Button
				type="submit"
				disabled={!joinRoomId.trim()}
				variant="secondary"
				sx={{
					borderRadius: 2.5,
					px: 3,
					textTransform: "none",
					fontWeight: "bold",
				}}
			>
				Join
			</Button>
		</Paper>
	);
}
