"use client";

import type { ReactNode } from "react";
import { Box, Divider, Stack } from "@mui/material";
import { Heading } from "@/components/ui";
import { Edit as EditIcon } from "@mui/icons-material";
import { avatarStyles } from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";

interface ProfileDetailsProps {
	userId: string;
	username: string;
	onEditAvatar?: () => void;
	actions?: ReactNode;
}

export function ProfileDetails({ userId, username, onEditAvatar, actions }: ProfileDetailsProps) {
	const avatar = (
		<UserAvatar userId={userId} username={username} sx={avatarStyles.large} />
	);

	return (
        <Stack spacing={2} sx={{ width: "100%" }}>
            <Stack direction="row" spacing={3} sx={{
                alignItems: "center"
            }}>
				{onEditAvatar ? (
					<Box
						component="button"
						onClick={onEditAvatar}
						aria-label="Modifier l'avatar"
						sx={{
							position: "relative",
							cursor: "pointer",
							border: "none",
							padding: 0,
							borderRadius: "50%",
							background: "none",
							flexShrink: 0,
							transition: "transform 160ms var(--ease-out), opacity 200ms ease",
							"&:active": { transform: "scale(0.97)" },
							"@media (hover: hover) and (pointer: fine)": {
								"&:hover": { opacity: 0.9 },
							},
						}}
					>
						{avatar}
						<Box
							aria-hidden="true"
							sx={{
								position: "absolute",
								bottom: 0,
								right: 0,
								width: 32,
								height: 32,
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								bgcolor: "primary.main",
								color: "primary.contrastText",
								border: "2px solid",
								borderColor: "background.paper",
							}}
						>
							<EditIcon sx={{ fontSize: 16 }} />
						</Box>
					</Box>
				) : (
					avatar
				)}
				<Heading level={5} noWrap sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
					{username}
				</Heading>
			</Stack>
            {actions && (
				<>
					<Divider />
					{actions}
				</>
			)}
        </Stack>
    );
}
