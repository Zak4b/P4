"use client";

import type { ReactNode } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { avatarStyles } from "@/lib/styles";
import UserAvatar from "@/components/UserAvatar";

interface ProfileDetailsProps {
	userId: string;
	login: string;
	onEditAvatar?: () => void;
	actions?: ReactNode;
}

export function ProfileDetails({ userId, login, onEditAvatar, actions }: ProfileDetailsProps) {
	const avatar = (
		<UserAvatar userId={userId} login={login} sx={{ ...avatarStyles.large, ...avatarStyles.gradientAvatar }} />
	);

	return (
		<Stack spacing={2} sx={{ width: "100%" }}>
			<Stack direction="row" spacing={3} alignItems="center">
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
							transition: "transform 200ms ease-out, opacity 200ms ease-out",
							"&:hover": { opacity: 0.9, transform: "scale(1.03)" },
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
				<Typography variant="h6" fontWeight={600} noWrap>
					{login}
				</Typography>
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
