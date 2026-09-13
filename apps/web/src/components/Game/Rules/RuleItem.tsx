import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";

export default function QuestItem({ title, description }: { title: string, description: string }) {

	return (
		<ListItem sx={{ py: 2 }}>
			<ListItemIcon>
				<CheckCircleOutlineOutlined color="success" />
			</ListItemIcon>
			<ListItemText
				primary={title}
				secondary={description}
				slotProps={{ primary: { sx: { fontWeight: "bold" } } }}
			/>
		</ListItem>
	);
}