class P4 {
	plateau = [];
	cPlayer = 1;
	last = { x: -1, y: -1 };
	win = false;
	constructor() {
		this.setDefault();
	}
	setDefault() {
		this.plateau = [];
		for (let i = 0; i < 7; i++) {
			this.plateau[i] = [];
			for (let j = 0; j < 6; j++) {
				this.plateau[i][j] = 0;
			}
		}
		this.cPlayer = 1;
		this.last = { x: -1, y: -1 };
		this.win = false;
	}
	play(playerId, x) {
		if (x < 0 || x > 6) {
			return -1;
		}
		let y = 0;
		while (y <= 5) {
			if (!this.plateau[x][y]) {
				this.plateau[x][y] = playerId;
				this._pSwap();
				this.last = { x: x, y: y };
				return y;
			}
			y++;
		}
		return -1;
	}
	_pSwap() {
		this.cPlayer = this.cPlayer == 2 ? 1 : 2;
	}
	getCombs(x, y) {
		let d1 = "";
		let d2 = "";
		const c = this.plateau[x].map(String).join("");
		const r = this.plateau
			.map((col) => col[y])
			.map(String)
			.join("");

		const z1 = Math.min(x, y);
		const xz1 = x - z1;
		const yz1 = y - z1;
		const rg1 = Math.min(6 - xz1, 5 - yz1) + 1;
		console.log(`diag1-> {${xz1},${yz1}} length:{${rg1}}`);
		for (let i = 0; i < rg1; i++) {
			d1 += this.plateau[i + xz1][i + yz1].toString();
		}

		const z2 = Math.min(6 - x, y);
		const xz2 = x + z2;
		const yz2 = y - z2;
		const rg2 = Math.min(xz2, 5 - yz2) + 1;
		console.log(`diag2-> {${xz2},${yz2}} length:{${rg2}}`);
		for (let i = 0; i < rg2; i++) {
			d2 += this.plateau[xz2 - i][i + yz2].toString();
		}
		d2 = d2.split("").reverse().join("");

		return { c: c, r: r, d1: d1, d2: d2 };
	}
	check(x, y) {
		if (!this.win) {
			const playerId = this.plateau[x][y];
			console.log(`Check win Player #${playerId} c{${x},${y}}`);
			const cb = this.getCombs(x, y);
			const cbString = Object.values(cb).join("|");
			console.log(cbString, cb);

			if (!new RegExp(`${playerId}{4,}`).test(cbString)) {
				return false;
			} else {
				this.win = playerId;
			}
			return true;
		}
	}
}
module.exports = P4;
