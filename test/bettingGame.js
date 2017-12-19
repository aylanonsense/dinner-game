import expect from 'expect';
import runSimulation from '../game/runSimulation';
import GameSimulation from '../game/GameSimulation';

class BettingGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 1;
	}
	run() {
		let possibleBets = [];
		for (let n = 0; n <= this.state.amount; n++) {
			possibleBets.push(n);
		}
		this.state.bet = this.players[0].choose(possibleBets);
		this.state.amount -= this.state.bet;
		if (this.choose([ false, true ], this.state.betSuccessful ? 1 : 0)) {
			this.state.amount += this.state.bet * this.state.payoutRate;
		}
	}
}

function runBettingSimulation(startingAmount, payoutRate, bonusThreshold, bonus, betSuccessful) {
	return runSimulation(new BettingGame(), {
		amount: startingAmount,
		payoutRate: payoutRate || 2,
		betSuccessful: betSuccessful || false
	}, function(state) {
		let fitness = state.amount;
		if (bonusThreshold && state.amount >= bonusThreshold) {
			fitness += bonus;
		}
		return fitness;
	}).state.bet;
}

describe('a betting game', () => {
	it('will bet it all if the payout rate is above 2x', () => {
		expect(runBettingSimulation(10, 2.1)).toEqual(10);
	});
	it('won\'t bet anything if the payout rate is below 2x', () => {
		expect(runBettingSimulation(10, 1.9)).toEqual(0);
	});
	it('will bet to try to get a bonus if it\'s worth it', () => {
		expect(runBettingSimulation(10, 1.5, 11, 2)).toEqual(2);
	});
	it('will not bet to try to get a bonus if it\'s not worth it', () => {
		expect(runBettingSimulation(10, 1.5, 18, 2)).toEqual(0);
	});
});