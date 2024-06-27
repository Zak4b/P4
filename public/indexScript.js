import { ClientP4, canvasInterface } from "./lib/class/ClientP4.js";
import { cloneTemplate, cloneTemplateById, copyCanvas, createElement } from "./lib/dom.js";
import { Messenger } from "./lib/class/Messenger.js";
import { RoomList } from "./lib/class/RoomList.js";
const socket = new WebSocket(window.location.pathname, ["ws", "wss"]);
const game = new ClientP4(socket);
const gameInterface = new canvasInterface(document.getElementById("canvas"), game, { width: null });
const messenger = new Messenger(document.getElementById("msg-area"), document.getElementById("msg"));

socket.addEventListener("open", () => {
	const intervalId = setInterval(() => {
		socket.send("ping");
	}, 30000);
	socket.addEventListener("close", () => {
		clearInterval(intervalId);
		messenger.info("Connexion perdue");
	});
});
game.addEventListener("join", (e) => {
	const { roomId, playerId } = e.detail;
	const advId = playerId == 1 ? 2 : 1;
	document.documentElement.style.setProperty("--self-color", gameInterface.getColor(playerId));
	document.documentElement.style.setProperty("--adv-color", gameInterface.getColor(advId));
	messenger.info(`Connecté à la Salle #${roomId}`);
});
game.addEventListener("play", (e) => {
	const { nextPlayerId } = e.detail;
	//new Audio("pop.mp3").play();
	changeIndicatorState(nextPlayerId);
});
game.addEventListener("sync", (e) => {
	const { cPlayer } = e.detail;
	changeIndicatorState(cPlayer);
});
game.addEventListener("win", (e) => {
	setTimeout(() => {
		const win = e.detail.uuid == game.uuid;
		showModal(win ? "Victoire" : "Défaite", copyCanvas(gameInterface.element, 460));
		win && setTimeout(() => game.send("restart"), 1000);
	}, 1000);
});
game.addEventListener("full", (e) => {
	showModal("Match Nul", copyCanvas(gameInterface.element, 460));
});
game.addEventListener("message", (e) => {
	const { clientId, message } = e.detail;
	messenger.message(message, game.uuid == clientId);
});
game.addEventListener("info", (e) => {
	messenger.info(e.detail);
});
game.addEventListener("vote", (e) => {
	messenger.vote(e.detail.text, e.detail.command);
});

messenger.addEventListener("send", (e) => {
	game.message(e.detail);
});

function changeIndicatorState(currentId) {
	const j1 = document.getElementById("indicator-j1");
	const j2 = document.getElementById("indicator-j2");
	j1.classList.toggle("disabled", currentId !== 1);
	j2.classList.toggle("disabled", currentId !== 2);
}

function showModal(title, content, footer = false) {
	const modal = document.getElementById("Modal");
	modal.querySelector(".modal-title").innerHTML = title;
	modal.querySelector(".modal-body").replaceChildren(content);
	if (!footer) modal.querySelector(".modal-footer").classList.toggle("d-none", !footer);
	const bsModal = new bootstrap.Modal(modal);
	bsModal.show();
	return bsModal;
}
const offCanvas = new bootstrap.Offcanvas("#offcanvas");
const rList = new RoomList(document.querySelector(".room-list"));

rList.addEventListener("join", (e) => {
	offCanvas.hide();
	game.message(`/join ${e.detail}`);
});
rList.addEventListener("create", (e) => {
	offCanvas.hide();
	const fragment = cloneTemplateById("template-room-new-form");
	const form = fragment.querySelector("form");
	const m = showModal("Nouveau", fragment);
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const data = new FormData(form);
		game.message(`/join ${data.get("roomId")}`);
		m.hide();
	});
});
