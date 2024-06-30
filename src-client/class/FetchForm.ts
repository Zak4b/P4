type fetchMod = { "Content-Type": string; formatData: (d: FormData) => any };
class FetchForm {
	#form: HTMLFormElement;
	#submitter: HTMLElement | null = null;
	#submitterContent: string = "";
	#loader: Node | null = null;
	#disabledCtrls: Element[] = [];
	static availableMods: { [mod_name: string]: fetchMod } = {
		urlencoded: {
			"Content-Type": "application/x-www-form-urlencoded",
			formatData: (dataForm: FormData) => {
				const params = new URLSearchParams();
				for (const pair of dataForm.entries()) {
					params.append(pair[0], pair[1].toString());
				}
				return params;
			},
		},
		json: {
			"Content-Type": "application/json",
			formatData: (dataForm: FormData) => {
				return JSON.stringify(Object.fromEntries(dataForm));
			},
		},
	};
	#selectedmode: fetchMod;
	constructor(form: HTMLFormElement, mode: "urlencoded" | "json" = "urlencoded") {
		this.#form = form;
		const template = document.querySelector(form.dataset["loader"] ?? "");
		if (template instanceof HTMLTemplateElement) this.#loader = template.content.cloneNode(true);

		this.#selectedmode = FetchForm.availableMods[mode];
		this.#form.addEventListener("submit", (e) => {
			this.#onSubmit(e);
		});
	}
	#onSubmit(event: SubmitEvent) {
		event.preventDefault();
		this.#submitter = event.submitter;
		const data = new FormData(this.#form);

		this.#toogleControls(false);

		const p = this.#fetch(data);
		p.catch((err) => {
			console.error(err);
		});
		p.then(async (res) => {
			res.ok ? this.#onFetchOK(res) : this.#onFetchError(res);
		});
	}
	#toogleControls(state: boolean | null = null) {
		if (!state) {
			this.#disabledCtrls = [...this.#form.querySelectorAll(".form-control")];
			if (this.#submitter) {
				this.#disabledCtrls.push(this.#submitter);
				if (this.#loader) {
					this.#submitterContent = this.#submitter.innerHTML;
					this.#submitter.replaceChildren(this.#loader.cloneNode(true));
				}
			}
		}
		const callBack = state ? (c: Element) => c.removeAttribute("disabled") : (c: Element) => c.setAttribute("disabled", "");
		for (const control of this.#disabledCtrls) {
			callBack(control);
		}
	}
	async #fetch(data: FormData): Promise<Response> {
		return fetch(this.#form.action, {
			method: this.#form.method,
			body: this.#selectedmode.formatData(data),
			headers: {
				"Content-Type": this.#selectedmode["Content-Type"],
				Accept: "application/json",
			},
		});
	}
	#onFetchOK(res: Response) {
		window.location.reload();
	}
	async #onFetchError(res: Response) {
		try {
			const data = await res.json();
			if (data.errForm) {
				this.#displayFormErros(data.errForm);
			}
			if (data.err) {
				console.error(data.err);
			}
		} catch {
			console.error("La réponse n'est pas au format json");
		} finally {
			this.#toogleControls(true);
			if (this.#loader && this.#submitter) {
				this.#submitter.innerHTML = this.#submitterContent;
			}
		}
	}
	#displayFormErros(errors: object, feedback = true) {
		const elemList: Element[] = [];
		const msgList: HTMLDivElement[] = [];
		Object.entries(errors).forEach(([controlName, errorMessage]) => {
			const elem = this.#form.querySelector(`[name=${controlName}]`);
			if (!elem) return;
			elemList.push(elem);
			elem.classList.add("is-invalid");
			let invalidMsg: HTMLDivElement | undefined;
			if (feedback) {
				invalidMsg = document.createElement("div");
				msgList.push(invalidMsg);
				invalidMsg.setAttribute("class", "invalid-feedback");
				invalidMsg.innerText = errorMessage;
				elem.after(invalidMsg);
			}
			elem.addEventListener(
				"change",
				() => {
					invalidMsg?.remove();
					elem.classList.remove("is-invalid");
				},
				{ once: true, passive: true }
			);
		});
		this.#form.addEventListener(
			"submit",
			(e) => {
				msgList.forEach((e) => e.remove());
				elemList.forEach((e) => {
					e.classList.remove("is-invalid");
				});
			},
			{ once: true, capture: true }
		);
	}
}
