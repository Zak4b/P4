import { P4 } from "./class/P4.js";
import { Player, GameRoomList } from "./class/gameRoom.js";
export const rooms = new GameRoomList(2, P4);
const regType = /^[a-z]+$/i;
function getSyncData(player) {
    const game = player.room?.game;
    if (!game) {
        throw new Error("");
    }
    const syncData = { playerId: player.playerId, cPlayer: game.cPlayer };
    if (game.playCount) {
        syncData.board = game.board;
    }
    return syncData;
}
export const websocketConnection = async (socket, req) => {
    const uuid = req.signedCookies.token?.uuid;
    const player = new Player(socket, uuid);
    console.log("Nouvelle connexion " + player.uuid);
    player.send("registered", player.uuid);
    socket.on("message", async (message) => {
        try {
            const messageObject = JSON.parse(message.toString());
            const { type, data } = messageObject;
            if (regType.test(String(type))) {
                socket.emit(`game-${type}`, data);
            }
        }
        catch (error) {
            return;
        }
    });
    socket.on("game-join", async (roomId) => {
        if (!/[\w0-9]+/.test(roomId) || player.room?.id == roomId)
            return;
        try {
            rooms.join(roomId, player);
            player.send("joined", { roomId: player.room.id, playerId: player.playerId });
            player.send("sync", getSyncData(player));
        }
        catch (error) {
            if (error instanceof Error) {
                console.warn(`${player.uuid} : ${error.message}`);
                player.send("info", `Impossible de rejoindre la Salle #${roomId}, ${error.message}`);
                player.send("vote", { text: "Passer en mode spectateur ?", command: `/spect ${roomId}` });
            }
            return;
        }
    });
    socket.on("game-play", async (x) => {
        if (player.playerId === null || player.room === null)
            return;
        if (player.room.game.win || player.room.game.full || player.playerId != player.room.game.cPlayer)
            return;
        const y = player.room.game.play(player.playerId, x);
        if (y < 0) {
            console.log("Forbiden");
        }
        else {
            player.room.send("play", { playerId: player.playerId, x, y, nextPlayerId: player.room.game.cPlayer });
            if (player.room.game.check(x, y)) {
                player.room.send("game-win", { uuid: player.uuid, playerid: player.playerId });
            }
            else if (player.room.game.full) {
                player.room.send("game-full");
            }
        }
    });
    socket.on("game-restart", async (data) => {
        if (player.room === null || typeof data === 'string') {
            return;
        }
        if (player.room.game.win || player.room.game.full || data?.forced) {
            player.room.game.setDefault();
            player.room.send("restart");
            player.room.send("sync", getSyncData(player));
        }
        else {
            // Vote restart
        }
    });
    const commandList = {
        help: async () => player.send("info", Object.keys(commandList)),
        join: async (roomId) => socket.emit("game-join", roomId),
        swap: async () => {
            if (!player.room || !player.playerId) {
                return;
            }
            player.data.set("swap", true);
            const other = player.room.playerList.filter((p) => p.uuid != player.uuid)[0];
            if (other.data.get("swap") === true) {
                const tmp = player.playerId;
                player.playerId = other.playerId;
                player.data.delete("swap");
                other.playerId = tmp;
                other.data.delete("swap");
                socket.emit("game-restart", { forced: true });
            }
            else {
                player.send("info", "Demande d'échange envoyé");
                other.send("vote", { text: "Echanger de couleur ?", command: "/swap" });
            }
        },
        spect: async (roomId) => {
            const room = rooms.get(roomId);
            if (room) {
                room.spect(player);
                player.send("info");
                player.send("sync", getSyncData(player));
            }
        },
        restart: async () => socket.emit("game-restart"),
        debug: async () => {
            console.log(rooms);
            console.log(player);
        },
    };
    const unknownHandler = async () => player.send("info", "Commande inconnue");
    socket.on("game-message", async (data) => {
        const text = (data ?? "").toString().trim();
        if (!text.match(/^\/\w+/)) {
            if (text.length > 0 && player.playerId !== null)
                player.room?.send("message", { clientId: player.uuid, message: text });
        }
        else {
            const match = text.match(/^\/(\w+)(?:\s+(\w+))?/);
            const command = match ? match[1] : "";
            const args = match ? match[2] : "";
            const cb = commandList[command] ?? unknownHandler;
            const argsArray = (args ?? "").split(/\s+/).filter((e) => e);
            cb(...argsArray);
        }
    });
};
