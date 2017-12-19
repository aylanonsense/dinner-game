import GameSimulation from '../GameSimulation';

class DinnerSimulation extends GameSimulation {
	getNumExpectedPlayers() {
		return this.state.guests.length;
	}
	run() {
		this.playTurn();
	}
	playTurn() {
		
	}
	drawCards(numCards) {}
}

export default DinnerSimulation;