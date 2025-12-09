import { EventEmitter } from "events";

export class Timer extends EventEmitter {
	private intervalId?: ReturnType<typeof setInterval>;
	private _elapsed = 0;
	private readonly limit: number;

	constructor(limit: number) {
		super();
		this.limit = limit;
	}

	public get elapsed(): number {
		return this.elapsed;
	}
	public get remaining(): number {
		return this.limit - this.elapsed;
	}

	public reset() {
		this._elapsed = 0;
	}

	public start() {
		if (this.intervalId) return;
		this.intervalId = setInterval(() => {
			this._elapsed++;
			if (this._elapsed >= this.limit) {
				this.stop();
				this.emit("end");
			}
		}, 1000);
	}

	private stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}
	}
}