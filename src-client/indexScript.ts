import { ClientP4, canvasInterface } from "./class/ClientP4.js";
import { showModal, roomList, offCanvas, modal } from "./script.js";
import { copyCanvas } from "./dom.js";
import { Messenger } from "./class/Messenger.js";
const socket = new WebSocket(window.location.pathname, ["ws", "wss"]);
const roomId = new URL(document.location.toString()).searchParams.get("roomId") ?? 1;
const game = new ClientP4(socket);
const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Impossible de charger l'interface de jeu");
const gameInterface = new canvasInterface(canvas, game, { onPlayerUpdate: changeIndicatorState });
const messageZone = document.getElementById("msg-area");
if (!(messageZone instanceof HTMLElement)) {
	console.error("Impossible de charger la zone de discution");
} else {
	const messenger = new Messenger(messageZone);
	game.listen("join-success", (e) => {
		const { roomId, playerId } = e.detail;
		history.replaceState({}, "", `?roomId=${roomId}`);
		const advId = playerId == 1 ? 2 : 1;
		document.documentElement.style.setProperty("--self-color", gameInterface.getColor(playerId));
		document.documentElement.style.setProperty("--adv-color", gameInterface.getColor(advId));
		messenger.info(`Connecté à la Salle #${roomId}`);
		socket.addEventListener("close", () => {
			messenger.info("Connexion perdue");
		});
	});
	game.listen("message", (e) => {
		const { clientId, message } = e.detail;
		messenger.message(message, game.uuid == clientId);
	});
	game.listen("info", (e) => {
		messenger.info(e.detail);
	});
	game.listen("vote", (e) => {
		messenger.vote(e.detail.text, e.detail.command);
	});

	messenger.listen("send", (e) => {
		game.message(e.detail);
	});
}

socket.addEventListener("open", () => {
	game.join(roomId.toString());
	const intervalId = setInterval(() => {
		socket.send("ping");
	}, 30000);
	socket.addEventListener("close", () => {
		clearInterval(intervalId);
	});
});
game.listen("game-win", (e) => {
	setTimeout(() => {
		const win = e.detail.uuid == game.uuid;
		showModal(win ? "Victoire" : "Défaite", copyCanvas(gameInterface.element, 460));
		win && setTimeout(() => game.send("restart"), 1000);
	}, 1000);
});
game.listen("game-full", (e) => {
	showModal("Match Nul", copyCanvas(gameInterface.element, 460));
});

const j1 = document.getElementById("indicator-j1");
const j2 = document.getElementById("indicator-j2");
function changeIndicatorState(currentId: number) {
	if (!j1 || !j2) return;
	j1.classList.toggle("disabled", currentId !== 1);
	j2.classList.toggle("disabled", currentId !== 2);
}
roomList.listen("beforeJoin", (e) => {
	e.preventDefault();
	offCanvas.hide();
	game.join(e.detail);
});
roomList.listen("beforeCreate", (e) => {
	e.preventDefault();
	modal.hide();
	game.join(e.detail);
});
