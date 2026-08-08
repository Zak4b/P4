import { Avatar, type AvatarProps } from "@mui/material";
import { AvatarApi } from "@/lib/api/avatar/avatar.api";

interface UserAvatarProps extends Omit<AvatarProps, "src"> {
	userId: string | null | undefined;
	login?: string | null;
	size?: number;
}

function getInitial(login: string | null | undefined): string {
	return login?.trim().charAt(0).toUpperCase() ?? "?";
}

/**
 * Composant Avatar réutilisable pour afficher l'avatar d'un utilisateur
 * @param userId - L'id de l'utilisateur
 * @param login - alt)
 * @param size - Taille optionnelle de l'avatar
 */
export default function UserAvatar({ userId, login, size = 50, sx, ...props }: UserAvatarProps) {
	return (
		<Avatar
			src={AvatarApi.url(userId)}
			alt={login ? `Avatar de ${login}` : "Avatar"}
			sx={{
				width: size,
				height: size,
				fontSize: size * 0.4,
				...sx,
			}}
			{...props}
		>
			{getInitial(login)}
		</Avatar>
	);
}
