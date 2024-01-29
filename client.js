const taille_C = 110; //Math.min((window.innerHeight * 0.9) / 6, (window.innerWidth * 0.9) / 7);
const width = 7 * taille_C;
const height = 6 * taille_C;
const canvas = document.querySelector("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

function init() {
	ctx.fillStyle = "#9c9c9c";
	ctx.fillRect(0, 0, width, height);

	ctx.strokeStyle = "#4444FF";
	ctx.lineWidth = 5;
	for (let i = 0; i < 8; i++) {
		ctx.beginPath();
		ctx.moveTo(i * taille_C, 0);
		ctx.lineTo(i * taille_C, height);
		ctx.stroke();
	}
	for (let i = 0; i < 7; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * taille_C);
		ctx.lineTo(width, i * taille_C);
		ctx.stroke();
	}
}
const PlayerClrs = ["#000000", "#CE1D30", "#FDD334"];
function draw(color, x, y) {
	ctx.beginPath();
	ctx.arc(x * taille_C + taille_C / 2, height - (y * taille_C + taille_C / 2), taille_C / 2 - 5, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}
canvas.addEventListener("click", (event) => {
	const { offsetX: i, offsetY: j } = event;
	const x = Math.floor(event.offsetX / taille_C);
	console.log(`Click (${i},${j}) -> c${x}`);
	socket.send(JSON.stringify({ act: "play", data: x }));
});
init();
let uuid = null;
let roomId = 1;
let playerId = null;
const socket = new WebSocket("ws://" + window.location.hostname + window.location.pathname);
const container = document.getElementById("msg-area");

socket.addEventListener("open", (event) => {
	console.log("Connexion établie avec le serveur WebSocket");
	socket.send(JSON.stringify({ act: "join", data: roomId }));
});

socket.addEventListener("message", (event) => {
	let message;
	try {
		message = JSON.parse(event.data);
	} catch (error) {
		console.warn(`Message invalide`);
		return;
	}
	console.log(message);
	const { act: action, data } = message;
	if (/^[a-z]+$/i.test(String(action))) socket.dispatchEvent(new CustomEvent(`act-${action}`, { detail: data }));
});
socket.addEventListener("act-registered", ({ detail: data }) => (uuid = data));
socket.addEventListener("act-joined", ({ detail: data }) => {
	roomId = data.roomId;
	playerId = data.playerId;
	const advId = playerId == 1 ? 2 : 1;
	document.documentElement.style.setProperty("--self-color", PlayerClrs[playerId]);
	document.documentElement.style.setProperty("--adv-color", [PlayerClrs[advId]]);
	info(`Connecté à la Salle #${roomId}`);
});
socket.addEventListener("act-play", ({ detail: data }) => {
	draw(PlayerClrs[data.playerId], data.x, data.y);
	changeIndicatorState(data.nextPlayerId);
});
socket.addEventListener("act-game-win", ({ detail: data }) => {
	if (data.uuid == uuid) {
		setTimeout(() => socket.send(JSON.stringify({ act: "restart" })), 5000);
	}
});
socket.addEventListener("act-sync", ({ detail: data }) => {
	const board = data.board;
	changeIndicatorState(data.cPlayer);
	for (let x = 0; x < board.length; x++) {
		for (let y = 0; y < board[x].length; y++) {
			const id = board[x][y];
			id && draw(PlayerClrs[id], x, y);
		}
	}
});
socket.addEventListener("act-info", ({ detail: data }) => {
	info(data);
});
socket.addEventListener("act-message", ({ detail: data }) => {
	container.innerHTML += `<div class="message-box"> <div class="message-${uuid == data.clientId ? "right" : "left"}"> <div class="message-bubble">${data.message}</div> </div> </div>`;
});
socket.addEventListener("act-restart", ({ detail: data }) => init());

socket.addEventListener("close", () => {
	console.log(">>> Connexion WebSocket fermée");
});
function info(texte) {
	container.innerHTML += `<div class="text-center w-100">${texte}</div>`;
}
function changeIndicatorState(currentId) {
	const j1 = document.getElementById("indicator-j1");
	const j2 = document.getElementById("indicator-j2");
	j1.classList.toggle("disabled", currentId !== 1);
	j2.classList.toggle("disabled", currentId !== 2);
}
function dbg() {
	socket.send(JSON.stringify({ act: "debug" }));
}
let inputBox = document.getElementById("msg");
inputBox.addEventListener("keypress", (e) => {
	if (e.charCode === 13) {
		socket.send(JSON.stringify({ act: "message", data: inputBox.value }));
		inputBox.value = "";
	}
});
