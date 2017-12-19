import expect from 'expect';
import runSimulation from '../game/runSimulation';
import GameSimulation from '../game/GameSimulation';

class DiceRollingGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 1;
	}
	run() {
		let min = this.state.rolls.length;
		let max = 6 * this.state.rolls.length;
		let possibleNumbers = [];
		for (let i = min; i <= max; i++) {
			possibleNumbers.push(i);
		}
		this.state.chosenNumber = this.players[0].choose(possibleNumbers);
		this.state.totalRoll = 0;
		for (let i = 0; i < this.state.rolls.length; i++) {
			if (this.state.isRandom) {
				this.state.totalRoll += this.choose([ 1, 2, 3, 4, 5, 6 ], this.state.rolls[i] - 1);
			}
			else {
				this.state.totalRoll += this.state.rolls[i];
			}
		}
	}
}

function runDiceRollingSimulation(evaluate, rolls, isRandom) {
	return runSimulation(new DiceRollingGame(), {
		rolls: rolls || [ 3, 4 ], isRandom: isRandom !== false
	}, evaluate).state.chosenNumber;
}

describe('a dice rolling game', () => {
	it('can guess the average of two dice to maximize its chances', () => {
		let chosenNumber = runDiceRollingSimulation(state => {
			return -Math.abs(state.chosenNumber - state.totalRoll); // the closer the better
		}, [ 1, 3 ]);
		expect(chosenNumber).toEqual(7);
	});
	it('can guess near the average of three dice to maximize its chances', () => {
		let chosenNumber = runDiceRollingSimulation(state => {
			return -Math.abs(state.chosenNumber - state.totalRoll);
		}, [ 1, 3, 2 ]);
		expect([ 10, 11 ]).toContain(chosenNumber);
	});
	it('can guess the exact amount when the rolls aren\'t random', () => {
		let chosenNumber = runDiceRollingSimulation(state => {
			return -Math.abs(state.chosenNumber - state.totalRoll);
		}, [ 5, 3, 6, 6, 5 ], false);
		expect(chosenNumber).toEqual(25);
	});
});