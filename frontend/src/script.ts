import { RoomList } from "./lib/class/RoomList.js";
//import * as bootstrap from "bootstrap";

//export const offCanvas = new bootstrap.Offcanvas("#offcanvas");

const modalElement = document.getElementById("Modal");
//export const modal = new bootstrap.Modal(modalElement);
export function showModal(title, content, footer = false) {
	modalElement.querySelector(".modal-title").innerHTML = title;
	modalElement.querySelector(".modal-body").replaceChildren(content);
	if (!footer) modalElement.querySelector(".modal-footer").classList.toggle("d-none", !footer);
	//modal.show();
}

export const roomList = new RoomList(document.querySelector(".room-list"), "api/rooms");
interface ToRoomFunction {
	(roomId: string): void;
}

const toRoom: ToRoomFunction = (roomId: string): void => {
	window.location.href = `?roomId=${roomId}`;
};
roomList.addEventListener("join", (e: CustomEvent) => {
	toRoom(e.detail);
});
roomList.addEventListener("create", (e: CustomEvent) => {
	toRoom(e.detail);
});
//document.getElementById("room-list-new").addEventListener("click", () => {
//	//offCanvas.hide();
//	const element = document.getElementById("template-room-new-form");
//	if (!(element instanceof HTMLTemplateElement)) return;
//	const fragment = element.content.cloneNode(true) as DocumentFragment;
//	const form = fragment.querySelector("form");

//	showModal("Nouveau", fragment);
//	form.addEventListener("submit", (e) => {
//		e.preventDefault();
//		const roomId = new FormData(form).get("roomId");
//		roomList.create(roomId);
//	});
//});
