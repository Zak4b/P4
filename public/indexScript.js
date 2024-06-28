import { ClientP4, canvasInterface } from "./lib/class/ClientP4.js";
import { showModal, roomList, offCanvas, modal } from "./script.js";
import { copyCanvas } from "./lib/dom.js";
import { Messenger } from "./lib/class/Messenger.js";
const socket = new WebSocket(window.location.pathname, ["ws", "wss"]);
const roomId = new URL(document.location.toString()).searchParams.get("roomId") ?? 1;
const game = new ClientP4(socket);
const gameInterface = new canvasInterface(document.getElementById("canvas"), game, { onPlayerUpdate: changeIndicatorState });
const messenger = new Messenger(document.getElementById("msg-area"));

socket.addEventListener("open", () => {
	game.join(roomId);
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
	history.replaceState({}, null, `?roomId=${roomId}`);
	const advId = playerId == 1 ? 2 : 1;
	document.documentElement.style.setProperty("--self-color", gameInterface.getColor(playerId));
	document.documentElement.style.setProperty("--adv-color", gameInterface.getColor(advId));
	messenger.info(`Connecté à la Salle #${roomId}`);
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
roomList.addEventListener("beforeJoin", (e) => {
	e.preventDefault();
	offCanvas.hide();
	game.join(e.detail);
});
roomList.addEventListener("beforeCreate", (e) => {
	e.preventDefault();
	modal.hide();
	game.join(e.detail);
});
