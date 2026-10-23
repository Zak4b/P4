import { Avatar, type AvatarProps } from "@mui/material";
import { AvatarApi } from "@/lib/api/avatar/avatar.api";

interface UserAvatarProps extends Omit<AvatarProps, "src"> {
	userId: string | null | undefined;
	username?: string | null;
	size?: number;
}

function getInitial(username: string | null | undefined): string {
	return username?.trim().charAt(0).toUpperCase() ?? "?";
}

/**
 * Composant Avatar réutilisable pour afficher l'avatar d'un utilisateur
 * @param userId - L'id de l'utilisateur
 * @param username - alt)
 * @param size - Taille optionnelle de l'avatar
 */
export default function UserAvatar({ userId, username, size = 50, sx, ...props }: UserAvatarProps) {
	return (
		<Avatar
			src={AvatarApi.url(userId)}
			alt={username ? `Avatar de ${username}` : "Avatar"}
			sx={{
				width: size,
				height: size,
				fontSize: size * 0.4,
				...sx,
			}}
			{...props}
		>
			{getInitial(username)}
		</Avatar>
	);
}
