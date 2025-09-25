import { ClientP4, canvasInterface } from "./lib/class/ClientP4.js";
import { showModal, roomList } from "./script.js";
import { copyCanvas } from "./lib/dom.js";
//import { Messenger } from "./lib/class/Messenger.js";
const socket = new WebSocket("ws://localhost:3000/P4");
const roomId = new URL(document.location.toString()).searchParams.get("roomId") ?? "1";
const client = new ClientP4(socket);
export const gameInterface = new canvasInterface(client);
//const messenger = new Messenger(document.getElementById("msg-area"));

socket.addEventListener("open", () => {
	client.join(roomId);
	const intervalId = setInterval(() => {
		socket.send("ping");
	}, 30000);
	socket.addEventListener("close", () => {
		clearInterval(intervalId);
		//messenger.info("Connexion perdue");
	});
});
client.addEventListener("join", (e: CustomEvent) => {
	const { roomId, playerId } = e.detail;
	history.replaceState({}, null, `?roomId=${roomId}`);
	const advId = playerId == 1 ? 2 : 1;
	document.documentElement.style.setProperty("--self-color", gameInterface.getColor(playerId));
	document.documentElement.style.setProperty("--adv-color", gameInterface.getColor(advId));
	//messenger.info(`Connecté à la Salle #${roomId}`);
});
client.addEventListener("win", (e: CustomEvent) => {
	setTimeout(() => {
		const win = e.detail.uuid == client.uuid;
		showModal(win ? "Victoire" : "Défaite", copyCanvas(gameInterface.element, 460));
		win && setTimeout(() => client.send("restart"), 1000);
	}, 1000);
});
client.addEventListener("full", (e) => {
	showModal("Match Nul", copyCanvas(gameInterface.element, 460));
});
client.addEventListener("message", (e: CustomEvent) => {
	const { clientId, message } = e.detail;
	//messenger.message(message, client.uuid == clientId);
});
client.addEventListener("info", (e: CustomEvent) => {
	//messenger.info(e.detail);
});
client.addEventListener("vote", (e: CustomEvent) => {
	//messenger.vote(e.detail.text, e.detail.command);
});

//messenger.addEventListener("send", (e: CustomEvent) => {
//client.message(e.detail);
//});
