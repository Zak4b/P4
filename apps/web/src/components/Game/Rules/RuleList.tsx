import { Divider, List } from "@mui/material";

import RuleItem from "./RuleItem";

const rules = [
	{
		title: "The Objective",
		description: "Connect 4 of your checkers in a row (horizontal, vertical, or diagonal) before your opponent.",
	},
	{
		title: "Taking Turns",
		description: "Players take turns dropping one checker into any of the seven columns.",
	},
] as const;

export default function RuleList() {
	return (
	<List>
		{rules.map((rule, index) => (
			<>
			{index > 0 && <Divider component="li" />}
			<RuleItem key={rule.title} title={rule.title} description={rule.description} />
			</>
		))}
	</List>
	);
}