import { Avatar, AvatarProps } from "@mui/material";
import { getAvatarUrl } from "@/lib/api";

interface UserAvatarProps extends Omit<AvatarProps, "src"> {
	login: string | null | undefined;
	size?: number;
}

/**
 * Composant Avatar réutilisable pour afficher l'avatar d'un utilisateur
 * @param login - Le login de l'utilisateur
 * @param size - Taille optionnelle de l'avatar
 */
export default function UserAvatar({ login, size = 50, sx, ...props }: UserAvatarProps) {
	return (
		<Avatar
			src={login ? getAvatarUrl(login) : undefined}
			sx={{
				width: size,
				height: size,
				...sx,
			}}
			{...props}
		/>
	);
}

