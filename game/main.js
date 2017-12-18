import runSimulation from './runSimulation';
import DinnerGame from './DinnerGame';

function generateState(numPlayers) {
	let state = {
		activeGuestIndex: 0,
		drawPile: [],
		discardPile: [],
		guests: []
	};
	for (let i = 0; i < numPlayers; i++) {
		state.guests[i] = {
			held: null,
			table: [],
			hand: [],
			plate: [],
			tummy: []
		};
	}
	return state;
}

function main() {
	let state = generateState(4);
	let game = new DinnerGame();
}

export default main;

// let state = {
// 	number1: null,
// 	number2: null,
// 	rolledNumber: null,
// 	rolls: [ 4, 3 ]
// };

// function evaluate(state) {
// 	if (typeof(state.rolledNumber) !== 'number') {
// 		throw new Error('Cannot evaluate non-number!');
// 	}
// 	else {
// 		let player1Dist = Math.abs(state.number1 - state.rolledNumber);
// 		let player2Dist = Math.abs(state.number2 - state.rolledNumber);
// 		if (player1Dist === player2Dist) {
// 			return -100;
// 		}
// 		if (this.index === 0) {
// 			return 10 - player1Dist;
// 		}
// 		else {
// 			return 10 - player2Dist;
// 		}
// 	}
// }

// console.log(runSimulation(new DinnerGame(), state, evaluate));