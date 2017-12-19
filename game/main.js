import runSimulation from './runSimulation';
import DinnerSimulation from './dinner-game/DinnerSimulation';
import generateState from './dinner-game/generateState';
import evaluate from './dinner-game/evaluate';

function main() {
	let game = new DinnerSimulation();
	let state = generateState(4);
	console.log('INITIAL STATE:');
	consoleLogState(state);
	console.log('\nRUNNING SIMULATION...');
	let outcome = runSimulation(game, state, evaluate);
	console.log('\nFINAL STATE:');
	consoleLogState(outcome.state);
	console.log('\nFINAL EVALUATIONS:');
	outcome.evaluations.forEach((evaluation, i) => {
		console.log(`  GUEST ${i + 1} got ${evaluation}`);
	});
}

function consoleLogState(state, ) {
	console.log(`  CURR GUEST:   guest ${state.currGuest + 1}`);
	console.log(`  DRAW PILE:    ${state.drawPile.slice(0, 5).map(card => card.type).join(', ')}${state.drawPile.length > 5 ? '...' : ''}`);
	console.log(`  DISCARD PILE: ${state.discardPile.slice(0, 5).map(card => card.type).join(', ')}${state.discardPile.length > 5 ? '...' : ''}`);
	state.guests.forEach((guest, i) => {
		console.log(`    GUEST ${i + 1}`);
		console.log(`        HAND:   ${guest.hand.map(card => card.type).join(', ')}`);
		console.log(`        TABLE:  ${guest.table.map(tile => tile.type).join(', ')}`);
		console.log(`        HELD:   ${guest.plate.held ? guest.plate.held.type : ''}`);
		console.log(`        PLATE:  ${guest.plate.map(card => card.type).join(', ')}`);
		console.log(`        TUMMY:  ${guest.plate.map(card => card.type).join(', ')}`);
	});
}

export default main;