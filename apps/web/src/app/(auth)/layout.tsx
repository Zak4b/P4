"use client";

import { Container, Box } from "@mui/material";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Box
			sx={{
				position: "relative",
				overflow: "hidden",
				minHeight: "100vh",
				backgroundColor: "board.frame",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				py: 4,
			}}
		>
			{/* Le même motif que l'accueil : deux jetons géants rognés par les bords. */}
			<Box
				aria-hidden
				data-motion=""
				sx={{
					position: "absolute",
					width: "90vmax",
					height: "90vmax",
					borderRadius: "50%",
					bgcolor: "board.player2",
					right: "-45vmax",
					top: "-30vmax",
					animation: "discIn 900ms var(--ease-out) both",
				}}
			/>
			<Box
				aria-hidden
				data-motion=""
				sx={{
					position: "absolute",
					width: "50vmax",
					height: "50vmax",
					borderRadius: "50%",
					bgcolor: "board.player1",
					left: "-22vmax",
					bottom: "-26vmax",
					animation: "discIn 900ms var(--ease-out) 120ms both",
				}}
			/>
			<Container
				maxWidth="sm"
				data-motion=""
				sx={{ position: "relative", animation: "riseIn 520ms var(--ease-out) 160ms both" }}
			>
				{children}
			</Container>
		</Box>
	);
}

