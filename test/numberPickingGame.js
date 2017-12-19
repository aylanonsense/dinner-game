import expect from 'expect';
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

function runNumberPickingSimulation(evaluate, possibleNumbers) {
	return runSimulation(new NumberPickingGame(), {
		possibleNumbers: possibleNumbers || [ 1, 4, 5, 4, 7, -2, 1, 1, 6 ]
	}, evaluate).state.chosenNumber;
}

describe('a number picking game', () => {
	it('can pick the largest number', () => {
		let chosenNumber = runNumberPickingSimulation(state => {
			return state.chosenNumber;
		});
		expect(chosenNumber).toEqual(7);
	});
	it('can pick the smallest number', () => {
		let chosenNumber = runNumberPickingSimulation(state => {
			return -state.chosenNumber;
		});
		expect(chosenNumber,).toEqual(-2);
	});
	it('can pick the largest even number', () => {
		let chosenNumber = runNumberPickingSimulation(state => {
			return state.chosenNumber%2 === 0 ? state.chosenNumber : -999;
		});
		expect(chosenNumber).toEqual(6);
	});
	it('can pick the most common number', () => {
		let chosenNumber = runNumberPickingSimulation(state => {
			return state.possibleNumbers.filter(n => n === state.chosenNumber).length;
		});
		expect(chosenNumber).toEqual(1);
	});
});