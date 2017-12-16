import runSimulation from './runSimulation';
import GameSimulation from './GameSimulation';

class NumberGuessingGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 2;
	}
	run() {
		let player1 = this.players[0];
		let player2 = this.players[1];
		// player 1 chooses a number from 1 to 13
		this.state.number1 = player1.choose([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]);
		// player 2 chooses a number from 1 to 13
		this.state.number2 = player2.choose([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ]);
		// roll two dice
		this.state.rolledNumber =
			this.choose([ 1, 2, 3, 4, 5, 6 ], this.state.rolls[0])
			+ this.choose([ 1, 2, 3, 4, 5, 6 ], this.state.rolls[1]);
	}
}

let state = {
	number1: null,
	number2: null,
	rolledNumber: null,
	rolls: [ 4, 3 ]
};

function evaluate(state) {
	if (typeof(state.rolledNumber) !== 'number') {
		throw new Error('Cannot evaluate non-number!');
	}
	else {
		let player1Dist = Math.abs(state.number1 - state.rolledNumber);
		let player2Dist = Math.abs(state.number2 - state.rolledNumber);
		if (player1Dist === player2Dist) {
			return -100;
		}
		if (this.index === 0) {
			return 10 - player1Dist;
		}
		else {
			return 10 - player2Dist;
		}
	}
}

console.log(runSimulation(new NumberGuessingGame(), state, evaluate));