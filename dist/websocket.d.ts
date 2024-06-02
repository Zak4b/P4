import { P4 } from "./class/P4.js";
import { GameRoomList } from "./class/gameRoom.js";
export declare const rooms: GameRoomList<typeof P4>;
export declare const websocketConnection: (socket: import("ws").WebSocket, req: import("express").Request) => Promise<void>;
