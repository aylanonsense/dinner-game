import expect from 'expect';
import runSimulation from '../game/runSimulation';
import GameSimulation from '../game/GameSimulation';

class RandomRollGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 1;
	}
	run() {
		let player = this.players[0];
		this.state.guess = player.choose([ 1, 2, 3 ]);
		this.state.numRolls = player.choose([ 0, 1, 2, 3 ]);
		for (let i = 0; i < this.state.numRolls; i++) {
			this.rand();
		}
		this.state.actual = this.choose([ 1, 2, 2, 2, 3, 4, 5, 6 ]);
	}
}

function runRandomRollSimulation(evaluate) {
	return runSimulation(new RandomRollGame('abcd'), {}, evaluate).state;
}

describe('a random rolling game', () => {
	it('cannot manipulate randomness', () => {
		/*
			with a seed of 'abcd' you get these outcomes:
				numRolls	actual
				0			4
				1			3
				2			3
				3			3

			but the player shouldn't be able to leverage that
			it should just guess the mode of 2
		*/
		let state = runRandomRollSimulation(state => {
			return state.guess == state.actual ? 1 : 0;
		});
		expect(state.guess).toEqual(2);
		expect(state.actual).toEqual(state.numRolls === 0 ? 4 : 3);
	});
});