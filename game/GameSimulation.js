import randomSeed from 'random-seed';

class GameSimulation {
	constructor(seed) {
		this.state = null;
		this.players = [];
		this.choose = null;
		this.seed = seed || 'default-seed';
		this._rand = null;
	}
	rand(...args) {
		if (!this._rand) {
			this._rand = randomSeed.create(this.seed);
		}
		return this._rand.random(...args);
	}
	reset(state, seed) {
		this.state = state;
		this.seed = seed || this.seed;
		this._rand = null;
	}
	getNumExpectedPlayers() {
		return 1;
	}
	run() {}
}

export default GameSimulation;