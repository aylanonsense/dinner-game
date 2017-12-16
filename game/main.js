import runSimulation from './runSimulation';
import GameSimulation from './GameSimulation';

class SillyCardPickingGame extends GameSimulation {
	getNumExpectedPlayers() {
		return 2;
	}
	run() {
		let player1 = this.players[0];
		let player2 = this.players[1];
		this.chooseAndRemoveCard(player1);
		this.chooseAndRemoveCard(player2);
		this.state.finalCard = this.chooseAndRemoveCard(player1);
	}
	chooseAndRemoveCard(player) {
		let card = player.choose(this.state.cards);
		this.state.cards.splice(this.state.cards.indexOf(card), 1);
		return card;
	}
}

let state = {
	cards: [ 5, 3, 7, 9, 1 ],
	finalCard: null
}

function evaluate(state) {
	if (typeof(state.finalCard) !== 'number') {
		throw new Error('Cannot evaluate non-number card!');
	}
	// if i am the player trying to get the highest number chosen
	else if (this.index === 0) {
		return state.finalCard;
	}
	// if iam the player trying to get the lowest number chosen
	else {
		return -state.finalCard;
	}
}

runSimulation(new SillyCardPickingGame(), state, evaluate);