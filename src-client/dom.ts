export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, attributes: { [key: string]: string } = {}): HTMLElementTagNameMap[K] {
	const e = document.createElement(tagName);
	for (const [type, value] of Object.entries(attributes)) {
		e.setAttribute(type, value);
	}
	return e as HTMLElementTagNameMap[K];
}
export function loadElement(selector: string | null | undefined): HTMLElement;
export function loadElement<T extends HTMLElement>(selector: string | null | undefined, type: new () => T): T;
export function loadElement<T extends HTMLElement>(selector: string | null | undefined, type?: new () => T): T | HTMLElement {
	const element = document.querySelector(selector ?? "");
	if (!element) {
		throw new Error(`Can't find element with selector "${selector}"`);
	} else if (!(element instanceof (type ?? HTMLElement))) {
		throw new Error(`Element does not match the specified type ${type?.name}`);
	} else {
		return element as T;
	}
}
export function cloneTemplate(templateElement: HTMLTemplateElement): DocumentFragment {
	if (!(templateElement instanceof HTMLTemplateElement)) {
		throw new Error("Element is not an instance of HTMLTemplateElement");
	} else {
		return templateElement.content.cloneNode(true) as DocumentFragment;
	}
}
export function cloneTemplateById(id: string): DocumentFragment {
	const template = document.getElementById(id) as HTMLTemplateElement;
	return cloneTemplate(template);
}

export function copyCanvas(original: HTMLCanvasElement, maxWidth: number, maxHeight: number | null = null) {
	const ratio = { w: 7, h: 6 };
	const dim = Math.floor(Math.min(maxWidth / ratio.w, (maxHeight ?? maxWidth) / ratio.h));
	const newCanvas = createElement("canvas", {
		width: (7 * dim).toString(),
		height: (6 * dim).toString(),
	});
	const ctx = newCanvas.getContext("2d");
	if (!ctx) {
		throw new Error("Can't get Canvas drawing context");
	} else {
		ctx.drawImage(original, 0, 0, newCanvas.width, newCanvas.height);
	}
	return newCanvas;
}
function scrollObserver(ratio = 0.4, cb = () => {}) {
	//Ratio = 0.4;
	let windowH = window.innerHeight;
	let sectionObserver = new IntersectionObserver(cb, { rootMargin: `-${Math.floor(windowH * (1 - ratio)) - 1}px 0px -${Math.floor(windowH * ratio)}px 0px` });
	return sectionObserver;
}
