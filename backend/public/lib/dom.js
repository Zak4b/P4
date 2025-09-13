/**
 * @param {string} tagName
 * @param {object} attributes
 * @returns {HTMLElement}
 */
export function createElement(tagName, attributes = {}) {
	const e = document.createElement(tagName);
	for (const [type, value] of Object.entries(attributes)) {
		e.setAttribute(type, value);
	}
	return e;
}
/**
 * @param {string} id
 * @returns {DocumentFragment}
 */
export function cloneTemplateById(id) {
	return cloneTemplate(document.getElementById(id));
}
/**
 * @param {HTMLTemplateElement} templateElement
 * @returns
 */
export function cloneTemplate(templateElement) {
	return templateElement.content.cloneNode(true);
}

/**
 * @param {HTMLCanvasElement} original
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @returns
 */
export function copyCanvas(original, maxWidth, maxHeight = null) {
	const ratio = { w: 7, h: 6 };
	const dim = Math.floor(Math.min(maxWidth / ratio.w, (maxHeight ?? maxWidth) / ratio.h));
	const newCanvas = createElement("canvas", {
		width: 7 * dim,
		height: 6 * dim,
	});
	newCanvas.getContext("2d").drawImage(original, 0, 0, newCanvas.width, newCanvas.height);
	return newCanvas;
}
function scrollObserver(ratio = 0.4, cb = () => {}) {
	//Ratio = 0.4;
	let windowH = window.innerHeight;
	let sectionObserver = new IntersectionObserver(cb, { rootMargin: `-${Math.floor(windowH * (1 - ratio)) - 1}px 0px -${Math.floor(windowH * ratio)}px 0px` });
	return sectionObserver;
}
