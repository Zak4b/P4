import type { Metadata } from "next";
import { LegalPage, LegalSection, P, Todo } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
	title: "Mentions légales · P4",
};

export default function MentionsLegalesPage() {
	return (
		<LegalPage title="Mentions légales" updatedAt="23 octobre 2026">
			<LegalSection title="Éditeur et hébergeur">
				<P>
					Site personnel et non commercial, édité et auto-hébergé sur un serveur personnel par{" "}
					<Todo>nom et prénom</Todo>, <Todo>adresse postale</Todo>, <Todo>téléphone</Todo>.
				</P>
				<P>
					Contact : <Todo>adresse email</Todo>.
				</P>
			</LegalSection>

			<LegalSection title="Crédits">
				<P>Avatars DiceBear, style « Micah » de Pablo Stanley (CC BY 4.0). Police Jost (SIL Open Font License).</P>
			</LegalSection>
		</LegalPage>
	);
}
