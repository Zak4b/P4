export abstract class Game {
	get pidValues(): number[] {
		return [1, 2];
	}
	start(): void {
		throw new Error("Method not implemented.");
	}
	stop(): void {
		throw new Error("Method not implemented.");
	}
	get winner(): number | undefined {
		return undefined;
	}
}
