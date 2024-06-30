import { Offcanvas, Modal } from "bootstrap";

import { RoomList } from "./class/RoomList.js";
import { cloneTemplate, cloneTemplateById, loadElement } from "./dom.js";
export const offCanvas = new Offcanvas("#offcanvas");

const modalElement = loadElement("#Modal");
export const modal = new Modal(modalElement);
export function showModal(title: string, content: HTMLElement | Node, footer: boolean = false) {
	const titleElem = modalElement.querySelector(".modal-title");
	if (titleElem) titleElem.innerHTML = title;
	modalElement.querySelector(".modal-body")?.replaceChildren(content);
	if (!footer) {
		const footerElem = modalElement.querySelector(".modal-footer");
		if (footerElem) footerElem.classList.toggle("d-none", !footer);
	}
	modal.show();
}

export const roomList = new RoomList(loadElement("#room-list"), "api/rooms");
const toRoom = (roomId: string) => {
	window.location.href = `?roomId=${roomId}`;
};
roomList.listen("join", (e) => {
	toRoom(e.detail);
});
roomList.listen("create", (e) => {
	toRoom(e.detail);
});
const formTemplate = loadElement("#template-room-new-form", HTMLTemplateElement);
loadElement("#room-list-new").addEventListener("click", () => {
	offCanvas.hide();

	const fragment = cloneTemplate(formTemplate);
	const form = fragment.querySelector("form") as HTMLFormElement;

	showModal("Nouveau", fragment);
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const roomId = new FormData(form).get("roomId");
		roomList.create(String(roomId));
	});
});
document.body.addEventListener("click", (e) => null);
