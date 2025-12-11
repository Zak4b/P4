import { EventEmitter } from "events";

export class Timer extends EventEmitter {
	private intervalId?: ReturnType<typeof setInterval>;
	private _elapsed = 0;
	private readonly limit: number;

	constructor(limit: number = 0) {
		super();
		this.limit = limit;
	}

	public get elapsed(): number {
		return this._elapsed;
	}
	public get remaining(): number {
		return this.limit - this.elapsed;
	}

	public reset() {
		this.stop();
		this._elapsed = 0;
	}

	public start() {
		if (this.intervalId) return;
		this.intervalId = setInterval(() => {
			this._elapsed++;
			if (this.limit !== 0 && this._elapsed >= this.limit) {
				this.stop();
				this.emit("end");
			}
		}, 1000);
	}

	public stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}
	}
}