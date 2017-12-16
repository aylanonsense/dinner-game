class GameSimulation {
	constructor() {
		this.state = null;
		this.matchesReality = true;
		this.players = [];
	}
	reset(state) {
		this.state = state;
		this.matchesReality = true;
	}
	getNumExpectedPlayers() {
		return 2;
	}
	run() {
		this.playTurn();
	}
	playTurn() {}
}