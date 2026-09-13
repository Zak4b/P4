"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { Button, Muted } from "@/components/ui";
import { ContentCopy as CopyIcon, Email as EmailIcon } from "@mui/icons-material";
import { layoutStyles } from "@/lib/styles";

interface ProfileEmailActionsProps {
	userId: string;
	email: string;
}

function copyStateLabel(state: "idle" | "copied" | "error") {
	switch (state) {
		case "copied":
			return "Copié !";
		case "error":
			return "Erreur";
		case "idle":
		default:
			return "";
	}
}

export function ProfileEmailActions({ userId, email }: ProfileEmailActionsProps) {
	const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

	const handleCopyId = async () => {
		try {
			await navigator.clipboard.writeText(userId);
			setCopyState("copied");
		} catch {
			// Presse-papiers indisponible (permissions, contexte non sécurisé).
			setCopyState("error");
		} finally {
			setTimeout(() => setCopyState("idle"), 2000);
		}
	};

	return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={layoutStyles.flexCenter}>
				<EmailIcon color="primary" aria-hidden="true" />
				<Muted variant="body1">{email}</Muted>
			</Box>
            <Button
				size="sm"
				variant={copyState === "error" ? "destructiveOutline" : "outline"}
				startIcon={<CopyIcon fontSize="small" />}
				sx={{ minHeight: 44 }}
				onClick={() => {
					handleCopyId().catch(() => {
						// Déjà géré par handleCopyId ; rien à faire ici.
					});
				}}
			>
				{copyStateLabel(copyState) || "Copier l'id"}
			</Button>
            <Box
				role="status"
				aria-live="polite"
				sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}
			>
				{copyState === "copied" && "Identifiant copié dans le presse-papiers"}
				{copyState === "error" && "Échec de la copie de l'identifiant"}
			</Box>
        </Box>
    );
}
