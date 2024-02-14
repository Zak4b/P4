import { cloneTemplate } from "../dom.js";
export class Messenger extends EventTarget {
	#element;
	#container;
	#input;
	/**@type {{msg:HTMLTemplateElement,info:HTMLTemplateElement|null,vote:HTMLTemplateElement|null}} */
	#templates = {};

	/**
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		super();
		this.#element = element;
		this.#container = element.querySelector(element.dataset["msgTarget"]);
		this.#input = element.querySelector(element.dataset["msgInput"]);
		this.#templates.info = document.querySelector(element.dataset["msgTemplateInfo"]);
		if (!this.#templates.info) {
			throw new Error("Template info manquante");
		}
		this.#templates.msg = document.querySelector(element.dataset["msgTemplateMsg"]) || null;
		if (!this.#templates.msg) {
			console.warn("Template msg manquante");
		}
		this.#templates.vote = document.querySelector(element.dataset["msgTemplateVote"]) || null;
		if (!this.#templates.vote) {
			console.warn("Template vote manquante");
		}
		this.#input?.addEventListener("keypress", (e) => {
			if (!e.shiftKey && e.key === "Enter") {
				const input = e.currentTarget;
				this.#send(input.value);
				input.value = "";
			}
		});
	}
	#send(data) {
		this.dispatchEvent(new CustomEvent("send", { detail: data }));
	}
	info(texte) {
		const msg = cloneTemplate(this.#templates.info);
		msg.querySelector(".message-content").innerText = `${this.dt()} ${texte}`;
		this.#container.appendChild(msg);
	}
	message(text, self) {
		let msg;
		try {
			msg = cloneTemplate(this.#templates.msg);
		} catch (e) {
			return this.info(text);
		}
		msg.querySelector(".message-side").setAttribute("class", `message-${self ? "right" : "left"}`);
		msg.querySelector(".message-content").innerText = text;
		this.#container.appendChild(msg);
	}
	vote(text, command) {
		let msg;
		try {
			msg = cloneTemplate(this.#templates.vote);
		} catch (e) {
			return this.info(text);
		}
		msg.querySelector(".message-content").innerText = text;
		const form = msg.querySelector(".vote-form");
		const btns = form.querySelectorAll(".vote-yes, .vote-no");
		const yes = form.querySelector(".vote-yes");
		form.addEventListener(
			"click",
			(e) => {
				e.target.classList.add("active");
				btns.forEach((btn) => {
					if (btn !== e.target) {
						btn.classList.add("disabled");
					}
				});
				if (e.target === yes) {
					this.#send(command);
				}
			},
			{ once: true }
		);
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
