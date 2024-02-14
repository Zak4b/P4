class FetchForm {
	/**@type {HTMLFormElement} */
	#form;
	/**@type {HTMLElement|null} */
	#submitter = null;
	#submitterContent = null;
	/**@type {HTMLElement|null} */
	#loader = null;
	/**@type {HTMLElement[]} */
	#disabledCtrls = [];
	static h = {
		urlencoded: { "Content-Type": "application/x-www-form-urlencoded", formatData: (dataForm) => new URLSearchParams(dataForm) },
		json: { "Content-Type": "application/json", formatData: (dataForm) => JSON.stringify(Object.fromEntries(dataForm)) },
	};
	#selectedmode;
	/**
	 * @param {HTMLFormElement} form
	 */
	constructor(form, mode = "urlencoded") {
		this.#form = form;
		this.#loader = document.querySelector(form.dataset["loader"]).content.cloneNode(true);
		this.#selectedmode = FetchForm.h[mode];
		this.#form.addEventListener("submit", (e) => {
			this.#onSubmit(e);
		});
	}
	/**
	 * @param {SubmitEvent} event
	 */
	#onSubmit(event) {
		event.preventDefault();
		this.#submitter = event.submitter;
		const data = new FormData(this.#form);

		this.#toogleControls(false);

		this.#fetch(data)
			.catch((err) => {
				console.error(err);
			})
			.then(async (res) => {
				res.ok ? this.#onFetchOK(res) : this.#onFetchError(res);
			});
	}
	/**
	 * @param {boolean} state
	 */
	#toogleControls(state = null) {
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
		const callBack = state ? (c) => c.removeAttribute("disabled") : (c) => c.setAttribute("disabled", "");
		for (const control of this.#disabledCtrls) {
			callBack(control);
		}
	}
	/**
	 * @param {FormData} data
	 * @returns {Promise<Response>}
	 */
	async #fetch(data) {
		return fetch(this.#form.action, {
			method: this.#form.method,
			body: this.#selectedmode.formatData(data),
			headers: {
				"Content-Type": this.#selectedmode["Content-Type"],
			},
		});
	}
	/**
	 * @param {Response} res
	 * @param {object} data
	 */
	#onFetchOK(res) {
		window.location.reload();
	}
	/**
	 * @param {Response} res
	 * @param {object} data
	 */
	async #onFetchError(res) {
		const data = await res.json();
		if (data.errForm) {
			this.#displayFormErros(data.errForm);
		}
		if (data.err) {
			console.error(data.err);
		}
		this.#toogleControls(true);
		if (this.#loader && this.#submitter) {
			this.#submitter.innerHTML = this.#submitterContent;
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
