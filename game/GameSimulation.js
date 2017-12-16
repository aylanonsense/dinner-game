class GameSimulation {
	constructor() {
		this.state = null;
		this.players = [];
	}
	reset(state) {
		this.state = state;
	}
	getNumExpectedPlayers() {
		return 1;
	}
	run() {}
}

export default GameSimulation;