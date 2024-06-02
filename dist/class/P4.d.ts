import { Game } from "./gameRoom.js";
export declare class P4 extends Game {
    #private;
    get pidValues(): number[];
    constructor();
    get board(): number[][];
    get cPlayer(): 2 | 1;
    get last(): {
        x: number;
        y: number;
    };
    get win(): number | boolean;
    get full(): boolean;
    get playCount(): number;
    setDefault(): void;
    play(playerId: 1 | 2, x: number): number;
    _pSwap(): void;
    getCombs(x: number, y: number): {
        c: string;
        r: string;
        d1: string;
        d2: string;
    };
    check(x: number, y: number): boolean;
    checkFull(): boolean;
}
