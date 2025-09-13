// Import the game modules - we'll need to adapt these to TypeScript
// @ts-ignore - Legacy JS modules
import { ClientP4, canvasInterface } from "./lib/class/ClientP4.js";
// @ts-ignore - Legacy JS modules
import { showModal, roomList, offCanvas, modal } from "./script.js";
// @ts-ignore - Legacy JS modules
import { copyCanvas } from "./lib/dom.js";
// @ts-ignore - Legacy JS modules
import { Messenger } from "./lib/class/Messenger.js";

// Game initialization function that can be called when the game page loads
export function initializeGame() {
  // Backend URL configuration
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:3000';

  // Create WebSocket connection
  const wsUrl = `${BACKEND_URL.replace('http', 'ws')}/P4`;
  const socket = new WebSocket(wsUrl, ["ws", "wss"]);

  // Get room ID from URL parameters
  const roomId = new URL(document.location.toString()).searchParams.get("roomId") ?? "1";

  // Initialize game components
  const game = new ClientP4(socket);
  const gameInterface = new canvasInterface(
    document.getElementById("canvas") as HTMLCanvasElement, 
    game, 
    { 
      colors: ["#dc3545", "#ffc107"], 
      width: 800, 
      height: 600, 
      static: false,
      onPlayerUpdate: changeIndicatorState 
    }
  );
  const messenger = new Messenger(document.getElementById("msg-area") as HTMLElement);

  // Socket event handlers
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

  // Game event handlers
  game.addEventListener("join", (e: CustomEvent) => {
    const { roomId, playerId } = e.detail;
    history.replaceState({}, '', `?roomId=${roomId}`);
    const advId = playerId == 1 ? 2 : 1;
    document.documentElement.style.setProperty("--self-color", gameInterface.getColor(playerId));
    document.documentElement.style.setProperty("--adv-color", gameInterface.getColor(advId));
    messenger.info(`Connecté à la Salle #${roomId}`);
  });

  game.addEventListener("win", (e: CustomEvent) => {
    setTimeout(() => {
      const win = e.detail.uuid == game.uuid;
      showModal(win ? "Victoire" : "Défaite", copyCanvas(gameInterface.element, 460));
      win && setTimeout(() => game.send("restart", null), 1000);
    }, 1000);
  });

  game.addEventListener("full", (_e: CustomEvent) => {
    showModal("Match Nul", copyCanvas(gameInterface.element, 460));
  });

  game.addEventListener("message", (e: CustomEvent) => {
    const { clientId, message } = e.detail;
    messenger.message(message, game.uuid == clientId);
  });

  game.addEventListener("info", (e: CustomEvent) => {
    messenger.info(e.detail);
  });

  game.addEventListener("vote", (e: CustomEvent) => {
    messenger.vote(e.detail.text, e.detail.command);
  });

  // Messenger events
  messenger.addEventListener("send", (e: CustomEvent) => {
    game.message(e.detail);
  });

  // Room list event handlers
  roomList.addEventListener("beforeJoin", (e: CustomEvent) => {
    e.preventDefault();
    offCanvas.hide();
    game.join(e.detail);
  });

  roomList.addEventListener("beforeCreate", (e: CustomEvent) => {
    e.preventDefault();
    modal.hide();
    game.join(e.detail);
  });

  // UI helper functions
  function changeIndicatorState(currentId: number) {
    const j1 = document.getElementById("indicator-j1");
    const j2 = document.getElementById("indicator-j2");
    if (j1) j1.classList.toggle("disabled", currentId !== 1);
    if (j2) j2.classList.toggle("disabled", currentId !== 2);
  }

  return { game, gameInterface, messenger, socket };
}

// Export default for backward compatibility
export default { initializeGame };