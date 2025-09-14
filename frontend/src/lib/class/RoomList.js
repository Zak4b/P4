export class RoomList extends EventTarget {
	/**@type {HTMLUListElement} */
	#element;
	/**@type {string} */
	#url;
	/**@type {HTMLTemplateElement} */
	#template;
	/**@type {IntersectionObserver} */
	#observer;
	/**@type {boolean} */
	#loading = false;

	/**
	 * @param {HTMLUListElement} element
	 * @param {string} url
	 */
	constructor(element, url) {
		super();
		this.#element = element;
		this.#url = url;
		//this.#template = document.getElementById(element.dataset["template"]);
		this.#observer = new IntersectionObserver(
			async (entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					this.#onShow();
				} else {
					this.#onHide();
				}
			},
			{ rootMargin: "-10px -10px -10px -10px" }
		);
		//this.#observer.observe(document.querySelector(".room-list"));
	}

	async #onShow() {
		if (this.#loading) return;
		this.#loading = true;
		try {
			const rooms = await (await fetch(this.#url)).json();
			for (const [roomId, room] of Object.entries(rooms)) {
				const { count, max } = room;
				const full = count >= max;
				const item = this.#template.content.cloneNode(true);
				item.querySelector(".placeholder-room-id").innerText = `#${roomId}`;
				const badge = item.querySelector(".placeholder-room-state");
				badge.innerText = `${count}/${max}`;
				const bt = item.querySelector("button");
				bt.addEventListener("click", (e) => {
					e.preventDefault();
					this.join(roomId);
				});
				if (full) {
					bt.classList.add("btn-secondary");
					badge.classList.add("bg-danger");
				} else {
					bt.classList.add("btn-primary");
				}
				this.#element.appendChild(item);
			}
		} catch (error) {
		} finally {
			this.#loading = false;
		}
	}
	#onHide() {
		this.#element.querySelectorAll("li:not(.room-list-persistent)").forEach((e) => e.remove());
	}

	create(roomId) {
		let detail = roomId;
		if (this.dispatchEvent(new CustomEvent("beforeCreate", { detail, cancelable: true }))) {
			this.dispatchEvent(new CustomEvent("create", { detail }));
		}
	}
	join(roomId) {
		let detail = roomId;
		if (this.dispatchEvent(new CustomEvent("beforeJoin", { detail, cancelable: true }))) {
			this.dispatchEvent(new CustomEvent("join", { detail }));
		}
	}
}
