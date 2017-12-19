import runSimulation from '../game/runSimulation';
import GameSimulation from '../game/GameSimulation';

class NumberPickingGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 1;
	}
	run() {
		this.state.chosenNumber = this.players[0].choose(this.state.possibleNumbers);
	}
}

function main() {
	console.log(runSimulation(new NumberPickingGame(), {
		possibleNumbers: [ 1, 4, 5, 4, 7, -2, 1, 1, 6 ]
	}, function(state) {
		return state.chosenNumber;
	}));
}

export default main;