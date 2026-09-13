import type { SxProps, Theme } from "@mui/material/styles";

type SxElement<T> = T extends ReadonlyArray<infer U> ? U : T;

export function toSxArray(sx: SxProps<Theme> | undefined): Array<SxElement<SxProps<Theme>>> {
	if (sx === undefined) {
		return [];
	}
	return (Array.isArray(sx) ? sx : [sx]) as Array<SxElement<SxProps<Theme>>>;
}
