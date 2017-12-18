class NumberPickingGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 1;
	}
	run() {
		this.state.chosenNumber = this.players[0].choose(this.state.possibleNumbers);
	}
}

function evaluate(state) {
	return state.number;
}

let outcome = runSimulation(new NumberPickingGame(), { number: null }, evaluate);


import assert from 'assert';
import runSimulation from './game/runSimulation';
import GameSimulation from './game/GameSimulation';

function runNumberPickingSimulation(evaluate, possibleNumbers) {
	return runSimulation(new NumberPickingGame(), {
		possibleNumbers: possibleNumbers || [ 1, 4, 5, 4, 7, -2, 1, 1, 6 ]
	}, evaluate);
}

describe('runSimulation', () => {
	describe('a number picking game', () => {
		it('can pick the largest number', () => {
			let outcome = runNumberPickingSimulation((state) => {
				return state.chosenNumber;
			});
			assert.equal(outcome.state.chosenNumber, 7);
		});
		it('can pick the smallest number', () => {
			let outcome = runNumberPickingSimulation((state) => {
				return -state.chosenNumber;
			});
			assert.equal(outcome.state.chosenNumber, -2);
		});
		it('can pick the largest even number', () => {
			let outcome = runNumberPickingSimulation((state) => {
				return state.chosenNumber%2 === 0 ? state.chosenNumber : -999;
			});
			assert.equal(outcome.state.chosenNumber, 6);
		});
		it('can pick the most common number', () => {
			let outcome = runNumberPickingSimulation((state) => {
				return state.possibleNumbers.filter(n => n === state.chosenNumber).length;
			});
			assert.equal(outcome.state.chosenNumber, 1);
		});
	});
});