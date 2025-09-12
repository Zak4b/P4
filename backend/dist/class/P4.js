import { Game } from "./gameRoom.js";
export class P4 extends Game {
    #board = [];
    #cPlayer = 1;
    #last = { x: -1, y: -1 };
    #win = 0;
    #full = false;
    #playCount = 0;
    #pidValues = [1, 2];
    get pidValues() {
        return this.#pidValues;
    }
    constructor() {
        super();
        this.setDefault();
    }
    get board() {
        return this.#board;
    }
    get cPlayer() {
        return this.#cPlayer;
    }
    get last() {
        return this.#last;
    }
    get win() {
        return this.#win;
    }
    get full() {
        return this.#full || this.checkFull();
    }
    get playCount() {
        return this.#playCount;
    }
    setDefault() {
        this.#board = [];
        for (let i = 0; i < 7; i++) {
            this.#board[i] = [];
            for (let j = 0; j < 6; j++) {
                this.#board[i][j] = 0;
            }
        }
        this.#cPlayer = 1;
        this.#last = { x: -1, y: -1 };
        this.#win = 0;
        this.#playCount = 0;
    }
    play(playerId, x) {
        if (x < 0 || x > 6) {
            return -1;
        }
        let y = 0;
        while (y <= 5) {
            if (!this.#board[x][y]) {
                this.#board[x][y] = playerId;
                this._pSwap();
                this.#last = { x: x, y: y };
                this.#playCount++;
                return y;
            }
            y++;
        }
        return -1;
    }
    _pSwap() {
        this.#cPlayer = this.#cPlayer == 2 ? 1 : 2;
    }
    getCombs(x, y) {
        let d1 = "";
        let d2 = "";
        const c = this.#board[x].map(String).join("");
        const r = this.#board
            .map((col) => col[y])
            .map(String)
            .join("");
        const z1 = Math.min(x, y);
        const xz1 = x - z1;
        const yz1 = y - z1;
        const rg1 = Math.min(6 - xz1, 5 - yz1) + 1;
        for (let i = 0; i < rg1; i++) {
            d1 += this.#board[i + xz1][i + yz1].toString();
        }
        const z2 = Math.min(6 - x, y);
        const xz2 = x + z2;
        const yz2 = y - z2;
        const rg2 = Math.min(xz2, 5 - yz2) + 1;
        for (let i = 0; i < rg2; i++) {
            d2 += this.#board[xz2 - i][i + yz2].toString();
        }
        d2 = d2.split("").reverse().join("");
        return { c: c, r: r, d1: d1, d2: d2 };
    }
    check(x, y) {
        if (this.#win) {
            return !!this.#win;
        }
        else {
            const playerId = this.#board[x][y];
            const cb = this.getCombs(x, y);
            const cbString = Object.values(cb).join("|");
            if (!new RegExp(`${playerId}{4,}`).test(cbString)) {
                return false;
            }
            else {
                this.#win = playerId;
            }
            return true;
        }
    }
    checkFull() {
        for (let i = 0; i < this.#board.length; i++) {
            for (let j = 0; j < this.#board[i].length; j++) {
                if (this.#board[i][j] === 0)
                    return false;
            }
        }
        return true;
    }
}
