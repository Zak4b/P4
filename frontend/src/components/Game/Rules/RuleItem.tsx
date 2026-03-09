import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

export default function QuestItem({ title, description }: { title: string, description: string }) {

	return (
		<ListItem sx={{ py: 2 }}>
			<ListItemIcon>
				<CheckCircleOutline color="success" />
			</ListItemIcon>
			<ListItemText
				primary={title}
				secondary={description}
				slotProps={{ primary: { fontWeight: 'bold' } }}
			/>
		</ListItem>
	);
}