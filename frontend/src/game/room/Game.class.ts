import { TypedEventEmitter } from "./TypedEventEmitter";

type BaseEventMap = {
	end: { winner: number, duration: number };
};

export abstract class Game<TEventMap extends BaseEventMap = BaseEventMap> {
	readonly pidValues: number[] = [1, 2];
	public abstract start(): void;
	public abstract stop(): void;
	public abstract end(): void;
	public abstract get winner(): number | undefined;
	
	protected readonly events: TypedEventEmitter<TEventMap> = new TypedEventEmitter<TEventMap>();
	public on = this.events.on.bind(this.events);
	public once = this.events.once.bind(this.events);
	public off = this.events.off.bind(this.events);
	protected emit = this.events.emit.bind(this.events);
}
