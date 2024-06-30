import { loadElement } from "../dom.js";
type ListEventData = string;
type RoomsData = { [key: string]: { count: number; max: number; full: boolean } };
// à importer depuis serveur
interface RoomListEvents {
	beforeJoin: ListEventData;
	join: ListEventData;
	beforeCreate: ListEventData;
	create: ListEventData;
}
export class RoomList extends EventTarget {
	#element: HTMLElement;
	#url: URL | string;
	#template: HTMLTemplateElement;
	#observer: IntersectionObserver;
	#loading: boolean = false;

	constructor(element: HTMLElement, url: URL | string) {
		super();
		this.#element = element;
		this.#url = url;
		this.#template = loadElement(element.dataset["template"], HTMLTemplateElement);
		this.#observer = new IntersectionObserver(
			async (entries) => {
				const entry = entries[0];
				entry.isIntersecting ? this.#onShow() : this.#onHide();
			},
			{ rootMargin: "-10px -10px -10px -10px" }
		);
		const observedElement = document.querySelector(".room-list");
		if (!observedElement) {
			console.error('No observable list with class "room-list"');
			this.#onShow();
		} else {
			this.#observer.observe(observedElement);
		}
	}
	addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
		console.error("addEventListener is disabled, use RoomList.listen()");
	}

	listen<K extends keyof RoomListEvents>(type: K, listener: (e: CustomEvent<RoomListEvents[K]>) => void, options?: boolean | AddEventListenerOptions) {
		super.addEventListener(type, listener as EventListener, options);
	}

	async #onShow() {
		if (this.#loading) return;
		this.#loading = true;
		try {
			const rooms: RoomsData = await (await fetch(this.#url)).json();
			for (const [roomId, room] of Object.entries(rooms)) {
				const { count, max } = room;
				const full = count >= max;
				const item = this.#template.content.cloneNode(true) as DocumentFragment;
				const idContainer = item.querySelector(".placeholder-room-id");
				if (idContainer instanceof HTMLElement) idContainer.innerText = `#${roomId}`;
				const badge = item.querySelector(".placeholder-room-state");
				if (badge instanceof HTMLElement) {
					badge.innerText = `${count}/${max}`;
					badge.classList.add("bg-danger");
				}
				const bt = item.querySelector("button");
				if (bt) {
					bt.classList.add(full ? "btn-secondary" : "btn-primary");
					bt.addEventListener("click", (e: MouseEvent) => {
						e.preventDefault();
						this.join(roomId);
					});
				}
				this.#element.appendChild(item);
			}
		} catch (error) {
			console.log(error);
		} finally {
			this.#loading = false;
		}
	}
	#onHide() {
		this.#element.querySelectorAll("li:not(.room-list-persistent)").forEach((e) => e.remove());
	}
	create(roomId: string) {
		let detail = roomId;
		if (this.dispatchEvent(new CustomEvent<ListEventData>("beforeCreate", { detail, cancelable: true }))) {
			this.dispatchEvent(new CustomEvent<ListEventData>("create", { detail }));
		}
	}
	join(roomId: string) {
		let detail = roomId;
		if (this.dispatchEvent(new CustomEvent<ListEventData>("beforeJoin", { detail, cancelable: true }))) {
			this.dispatchEvent(new CustomEvent<ListEventData>("join", { detail }));
		}
	}
}
