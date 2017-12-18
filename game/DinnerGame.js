import GameSimulation from './GameSimulation';

/*
example state:
	{
		activeGuestIndex: 0,
		drawPile: [],
		discardPile: [],
		guests: [
			{
				held: { tileType: 'green bean casserole' },
				table: [],
				hand: [],
				plate: [],
				tummy: []
			}
		]
	}
*/

class DinnerGame extends GameSimulation {
	getNumExpectedPlayers() {
		return this.state.guests.length;
	}
	run() {
		this.playTurn();
	}
	playTurn() {
		let player = this.players[this.state.activeGuestIndex];
		let guest = this.state.guests[this.state.activeGuestIndex];
		// the player chooses how to spend their turn
		let turnMode = player.choose([
			'draw cards',
			'play cards'
		]);
		// 
		if (turnMode === 'draw cards') {
			// let cards = this.drawCards(3);
		}
		else if (turnMode === 'play cards') {
			// let 
		}
		// move on to the next player's turn
		this.state.activeGuestIndex = (this.state.activeGuestIndex + 1) % this.state.guests.length;
	}
	drawCards(numCards) {

	}
}

export default DinnerGame;