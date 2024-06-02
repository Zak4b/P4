/// <reference types="node" resolution-mode="require"/>
import { WebSocket } from "ws";
import { EventEmitter } from "events";
export declare abstract class Game {
    get pidValues(): number[];
}
export declare class Player<T extends new () => Game> {
    #private;
    constructor(socket: WebSocket, uuid?: string | null);
    get uuid(): string;
    get playerId(): number | null;
    get data(): Map<any, any>;
    set playerId(id: number | null);
    get room(): GameRoom<T> | null;
    set room(room: GameRoom<T>);
    send(type: string, data?: string | object): Promise<void>;
}
export declare class GameRoom<T extends new () => Game> extends EventEmitter {
    #private;
    constructor(id: string, playerMaxCount: number, gameClass: T);
    get id(): string;
    get playerMaxCount(): number;
    get game(): InstanceType<T>;
    get playerCount(): number;
    get playerList(): Player<T>[];
    get registeredPlayerList(): {
        uuid: string;
        playerId: number;
    }[];
    get timeStamp(): number;
    join(player: Player<T>): void;
    remove(player: Player<T>): void;
    spect(player: Player<T>): void;
    send(type: string, data?: string | object): Promise<void>;
}
export declare class GameRoomList<T extends new () => Game> {
    #private;
    constructor(playerMaxCount: number, gameClass: T);
    get list(): {
        [key: string]: GameRoom<T>;
    };
    get(roomId: string): GameRoom<T> | false;
    getOrCreate(roomId: string): GameRoom<T>;
    join(roomId: string, player: Player<T>): void;
}
