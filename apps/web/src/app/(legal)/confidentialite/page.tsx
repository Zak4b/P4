import type { Metadata } from "next";
import { LegalPage, LegalSection, P, Todo } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
	title: "Confidentialité · P4",
};

export default function ConfidentialitePage() {
	return (
		<LegalPage title="Confidentialité" updatedAt="23 octobre 2026">
			<LegalSection title="Tes données">
				<P>
					Le site conserve ton pseudo, ton email, ton mot de passe chiffré, tes parties et tes amis, uniquement
					pour faire fonctionner le jeu. Ton email n&apos;est jamais affiché ni partagé. Les seuls cookies servent
					à garder ta session ouverte.
				</P>
				<P>
					Tes données sont gardées tant que ton compte existe. Pour les supprimer, écris à{" "}
					<Todo>adresse email</Todo>.
				</P>
			</LegalSection>
		</LegalPage>
	);
}
