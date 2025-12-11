import { EventEmitter } from "events";

/**
 * @template TEventMap - A type mapping event names to their data types
 * 
 * @example
 * type GameEvents = {
 *   win: { playerId: number };
 *   draw: undefined;
 *   move: { x: number; y: number };
 * };
 * 
 * class MyGame extends TypedEventEmitter<GameEvents> {
 *   // Can use this.on("win", (data) => ...) with full type safety
 * }
 */
export class TypedEventEmitter<TEventMap extends Record<string, any>> {
	protected events = new EventEmitter();

	public on<T extends keyof TEventMap>(
		event_type: T,
		cb: TEventMap[T] extends undefined ? () => void : (data: TEventMap[T]) => void
	): this {
		this.events.on(event_type as string, cb as (...args: any[]) => void);
		return this;
	}

	public once<T extends keyof TEventMap>(
		event_type: T,
		cb: TEventMap[T] extends undefined ? () => void : (data: TEventMap[T]) => void
	): this {
		this.events.once(event_type as string, cb as (...args: any[]) => void);
		return this;
	}

	public off<T extends keyof TEventMap>(
		event_type: T,
		cb: TEventMap[T] extends undefined ? () => void : (data: TEventMap[T]) => void
	): this {
		this.events.off(event_type as string, cb as (...args: any[]) => void);
		return this;
	}

	public emit<T extends keyof TEventMap>(
		event_type: T,
		...args: TEventMap[T] extends undefined ? [] : [data: TEventMap[T]]
	): boolean {
		return this.events.emit(event_type as string, args[0]);
	}

	public removeAllListeners(event?: keyof TEventMap): this {
		if (event) {
			this.events.removeAllListeners(event as string);
		} else {
			this.events.removeAllListeners();
		}
		return this;
	}
}

