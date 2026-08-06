/** Groupes de routes affichés dans Swagger UI — l'ordre du tableau fixe l'ordre des sections. */
export const TAGS = {
	auth: "Auth",
	me: "Me",
	users: "Users",
	leaderboard: "Leaderboard",
	friends: "Friends",
	friendRequests: "Friend requests",
	matches: "Matches",
	rooms: "Rooms",
} as const;

export const tagDefinitions = [
	{ name: TAGS.auth, description: "Inscription, connexion (email/password et Google) et session" },
	{ name: TAGS.me, description: "Profil du joueur authentifié" },
	{ name: TAGS.users, description: "Joueurs, profils publics, statistiques et relation d'amitié" },
	{ name: TAGS.leaderboard, description: "Classement des joueurs par ELO" },
	{ name: TAGS.friends, description: "Relations d'amitié établies" },
	{ name: TAGS.friendRequests, description: "Demandes d'ami en attente, reçues comme envoyées" },
	{ name: TAGS.matches, description: "Historique des parties" },
	{ name: TAGS.rooms, description: "Salons de jeu" },
];
