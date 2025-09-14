interface FormatMode {
	"Content-Type": string;
	formatData: (dataForm: FormData) => string | URLSearchParams;
}

interface FormatModes {
	[key: string]: FormatMode;
}
class FetchForm {
	#form: HTMLFormElement;
	#submitter: HTMLElement | null = null;
	#submitterContent: string | null = null;
	#loader: HTMLElement | null = null;
	#disabledCtrls: HTMLElement[] = [];

	static h: FormatModes = {
		//urlencoded: {
		//	"Content-Type": "application/x-www-form-urlencoded",
		//	formatData: (dataForm: FormData): URLSearchParams => new URLSearchParams(dataForm),
		//},
		json: {
			"Content-Type": "application/json",
			formatData: (dataForm: FormData): string => JSON.stringify(Object.fromEntries(dataForm)),
		},
	};
	#selectedmode;
	/**
	 * @param {HTMLFormElement} form
	 */
	constructor(form: HTMLFormElement, mode = "json") {
		this.#form = form;
		const loaderElem = document.querySelector(form.dataset["loader"]);
		this.#loader = loaderElem instanceof HTMLTemplateElement ? (loaderElem.content.cloneNode(true) as HTMLElement) : null;
		this.#selectedmode = FetchForm.h[mode];
		this.#form.addEventListener("submit", (e) => {
			this.#onSubmit(e);
		});
	}
	#onSubmit(event: SubmitEvent) {
		event.preventDefault();
		this.#submitter = event.submitter;
		const data = new FormData(this.#form);

		this.#toogleControls(false);

		this.#fetch(data)
			.then(async (res) => {
				if (res && res.ok) {
					this.#onFetchOK(res);
				} else if (res) {
					this.#onFetchError(res);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
	/**
	 * @param {boolean} state
	 */
	#toogleControls(state: boolean = null) {
		if (!state) {
			this.#disabledCtrls = Array.from(this.#form.querySelectorAll(".form-control")) as HTMLElement[];
			if (this.#submitter) {
				this.#disabledCtrls.push(this.#submitter);
				if (this.#loader) {
					this.#submitterContent = this.#submitter.innerHTML;
					this.#submitter.replaceChildren(this.#loader.cloneNode(true));
				}
			}
		}
		const callBack = state ? (c) => c.removeAttribute("disabled") : (c) => c.setAttribute("disabled", "");
		for (const control of this.#disabledCtrls) {
			callBack(control);
		}
	}
	/**
	 * @param {FormData} data
	 * @returns {Promise<Response>}
	 */
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
	/**
	 * @param {Response} res
	 * @param {object} data
	 */
	#onFetchOK(res: Response) {
		window.location.reload();
	}
	/**
	 * @param {Response} res
	 * @param {object} data
	 */
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
	#displayFormErros(errors, feedback = true) {
		const elemList = [];
		const msgList = [];
		Object.entries(errors).forEach(([controlName, errorMessage]) => {
			const elem = this.#form.querySelector(`[name=${controlName}]`);
			elemList.push(elem);
			elem.classList.add("is-invalid");
			let invalidMsg = null;
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
