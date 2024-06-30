import { cloneTemplate, loadElement } from "../dom.js";
interface MessengerEvents {
	send: string;
}
export class Messenger extends EventTarget {
	#element: HTMLElement;
	#container: HTMLElement;
	#input: HTMLInputElement;
	#templates: { info: HTMLTemplateElement; msg?: HTMLTemplateElement; vote?: HTMLTemplateElement };

	constructor(element: HTMLElement) {
		super();
		this.#element = element;

		this.#templates = { info: loadElement(element.dataset["msgTemplateInfo"], HTMLTemplateElement) };
		this.#templates.msg = loadElement(element.dataset["msgTemplateMsg"], HTMLTemplateElement);
		this.#templates.vote = loadElement(element.dataset["msgTemplateVote"], HTMLTemplateElement);

		this.#container = loadElement(element.dataset["msgTarget"]);
		this.#input = loadElement(element.dataset["msgInput"], HTMLInputElement);

		this.#input?.addEventListener("keypress", (e: KeyboardEvent) => {
			if (!e.shiftKey && e.key === "Enter") {
				const input = e.currentTarget;
				this.#send(this.#input.value);
				this.#input.value = "";
			}
		});
	}
	addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
		console.error("addEventListener is disabled, use Messenger.listen()");
	}

	listen<K extends keyof MessengerEvents>(type: K, listener: (e: CustomEvent<MessengerEvents[K]>) => void, options?: boolean | AddEventListenerOptions) {
		super.addEventListener(type, listener as EventListener, options);
	}

	#send(data: string | object) {
		this.dispatchEvent(new CustomEvent("send", { detail: data }));
	}
	info(texte: string) {
		const msg = cloneTemplate(this.#templates.info);
		const content = msg.querySelector(".message-content");
		if (content instanceof HTMLElement) content.innerText = `${this.dt()} ${texte}`;
		this.#container.appendChild(msg);
	}
	message(text: string, self: boolean) {
		if (!this.#templates.msg) return this.info(text);
		const msg = cloneTemplate(this.#templates.msg);
		msg.querySelector(".message-side")?.setAttribute("class", `message-${self ? "right" : "left"}`);
		const content = msg.querySelector(".message-content");
		if (content instanceof HTMLElement) content.innerText = text;
		this.#container.appendChild(msg);
	}
	vote(text: string, command: string) {
		if (!this.#templates.vote) return this.info(text);
		const msg = cloneTemplate(this.#templates.vote);
		const content = msg.querySelector(".message-content");
		if (content instanceof HTMLElement) content.innerText = text;
		const form = msg.querySelector(".vote-form");
		if (form instanceof HTMLElement) {
			const btns = form.querySelectorAll(".vote-yes, .vote-no");
			const yes = form.querySelector(".vote-yes");
			const handler = (e: MouseEvent) => {
				if (!(e.target instanceof HTMLElement) || !Array.from(btns).includes(e.target)) return;

				e.target.classList.add("active");
				btns.forEach((btn) => {
					if (btn !== e.target) btn.classList.add("disabled");
				});
				if (e.target === yes) this.#send(command);
			};
			form.addEventListener("click", handler, { once: true });
		}
		this.#container.appendChild(msg);
	}

	dt() {
		const now = new Date(Date.now());
		const h = now.getHours().toString().padStart(2, "0");
		const m = now.getMinutes().toString().padStart(2, "0");
		const s = now.getSeconds().toString().padStart(2, "0");
		return `${h}:${m}:${s}`;
	}
}
