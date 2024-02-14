import { P4 } from "./P4.js";
export class P4Interface extends P4 {
	#pidValues:number[] = [1, 2];
	constructor() {
		super();
	}
	get pidValues() {
		return this.#pidValues;
	}
}
