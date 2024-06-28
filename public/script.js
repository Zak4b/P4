import { RoomList } from "./lib/class/RoomList.js";

export const offCanvas = new bootstrap.Offcanvas("#offcanvas");

export const modal = new bootstrap.Modal(document.getElementById("Modal"));
export function showModal(title, content, footer = false) {
	modal._element.querySelector(".modal-title").innerHTML = title;
	modal._element.querySelector(".modal-body").replaceChildren(content);
	if (!footer) modal._element.querySelector(".modal-footer").classList.toggle("d-none", !footer);
	modal.show();
}

export const roomList = new RoomList(document.querySelector(".room-list"), "api/rooms");
const toRoom = (roomId) => {
	window.location.href = `?roomId=${roomId}`;
};
roomList.addEventListener("join", (e) => {
	toRoom(e.detail);
});
roomList.addEventListener("create", (e) => {
	toRoom(e.detail);
});
document.getElementById("room-list-new").addEventListener("click", () => {
	offCanvas.hide();
	const fragment = document.getElementById("template-room-new-form").content.cloneNode(true);
	const form = fragment.querySelector("form");

	showModal("Nouveau", fragment);
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const roomId = new FormData(form).get("roomId");
		roomList.create(roomId);
	});
});
