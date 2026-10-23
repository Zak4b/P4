import { Style } from "@dicebear/core";
import micah from "@dicebear/styles/micah.json";


export const micahStyle: Style = new Style(micah);

export const micahColors: Record<string, string[]> = Object.fromEntries(
	Object.entries(micah.colors).map(([name, color]) => [name, [...color.values]]),
);
