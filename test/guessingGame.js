import expect from 'expect';
import runSimulation from '../game/runSimulation';
import GameSimulation from '../game/GameSimulation';

class GuessingGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 2;
	}
	run() {
		if (this.state.rollFirst) {
			// twice as likely to be 2
			this.state.secretNumber = this.choose([ 1, 2, 2, 3 ], 3, this.state.player1Knows ? [ this.players[0] ] : null);
		}
		if (this.state.chooseSecretly) {
			this.state.guesses[0] = this.players[0].chooseSecretly([ 1, 2, 3 ]);
			this.state.guesses[1] = this.players[1].chooseSecretly([ 1, 2, 3 ]);
		}
		else {
			this.state.guesses[0] = this.players[0].choose([ 1, 2, 3 ]);
			this.state.guesses[1] = this.players[1].choose([ 1, 2, 3 ]);
		}
		if (!this.state.rollFirst) {
			this.state.secretNumber = this.choose([ 1, 2, 2, 3 ], 3, this.state.player1Knows ? [ this.players[0] ] : null);
		}
	}
}

function runGuessingSimulation(evaluate, rollFirst, player1Knows, chooseSecretly) {
	return runSimulation(new GuessingGame(), {
		guesses: [],
		rollFirst: rollFirst || false,
		player1Knows: player1Knows || false,
		chooseSecretly: chooseSecretly || false
	}, evaluate).state.guesses;
}

describe('a guessing game', () => {
	it('can pick the most likely option', () => {
		let guesses = runGuessingSimulation(function(state) {
			return (state.guesses[this.index] === state.secretNumber ? 1 : 0);
		});
		expect(guesses).toEqual([ 2, 2 ]);
	});
	it('can pick the correct option if the roll happens first', () => {
		let guesses = runGuessingSimulation(function(state) {
			return (state.guesses[this.index] === state.secretNumber ? 1 : 0);
		}, true);
		expect(guesses).toEqual([ 3, 3 ]);
	});
	it('can pick the correct option if the roll is known to the player', () => {
		let guesses = runGuessingSimulation(function(state) {
			return (state.guesses[this.index] === state.secretNumber ? 1 : 0);
		}, false, true);
		expect(guesses).toEqual([ 3, 2 ]);
	});
	it('can always pick the first player\'s number', () => {
		let guesses = runGuessingSimulation(function(state) {
			if (this.index === 0) {
				return (state.guesses[0] === state.secretNumber ? 1 : 0) +
					(state.guesses[0] === state.guesses[1] ? -100 : 0);

			}
			else {
				return (state.guesses[0] === state.guesses[1] ? 100 : 0);
			}
		});
		expect(guesses).toEqual([ 2, 2 ]);
	});
	it('can never pick the second player\'s number', () => {
		let guesses = runGuessingSimulation(function(state) {
			if (this.index === 0) {
				return (state.guesses[0] === state.secretNumber ? 1 : 0) +
					(state.guesses[0] === state.guesses[1] ? 100 : 0);

			}
			else {
				return (state.guesses[0] === state.guesses[1] ? -100 : 0);
			}
		});
		expect(guesses[0]).toEqual(2);
		expect([ 1, 3 ]).toContain(guesses[1]);
	});
	// it('can\'t always pick the first player\'s number if it\'s chosen secretly', () => {
	// 	let guesses = runGuessingSimulation(function(state) {
	// 		if (this.index === 0) {
	// 			return (state.guesses[0] === state.guesses[1] ? -100 : 0);

	// 		}
	// 		else {
	// 			return (state.guesses[0] === state.guesses[1] ? 100 : 0);
	// 		}
	// 	}, false, false, true);
	// 	expect(guesses).toEqual([ 2, 2 ]);
	// });
});