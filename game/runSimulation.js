import clone from 'clone';
import Player from './Player';

function runSimulation(game, state, evaluate) {
	// reset the game
	game.reset(state);

	// create a history of choices
	let history = [];
	let index = -1;

	// create a function for choosing from a list of options
	function choose(options) {
		// a choice with one or fewer options doesn't count as a meaningful choice
		if (!options || options.length === 0) {
			return null;
		}
		else if (options.length === 1) {
			return options[0];
		}
		else {
			index += 1;
			// just blindly choose the first option to begin
			if (!history[index]) {
				history[index] = {
					player: this,
					numOptions: options.length,
					choice: 0,
					outcomes: []
				};
			}
			// otherwise just choose based on whatever's in the history
			return options[history[index].choice];
		}
	}

	// create players
	game.players = [];
	for (let i = 0; i < game.getNumExpectedPlayers(); i++) {
		game.players.push(new Player(i, choose, evaluate));
	}

	// iterate until we arrive at a final outcome
	let finalOutcome = null;
	let attemptsLeft = 500;
	do {
		// run the simulation for a bit, thus forcing the players to make choices
		game.reset(clone(state));
		game.run();
		// get the final state of the game
		let finalState = game.state;
		// have each player evaluate the outcome of the game
		let evaluations = game.players.map(player => player.evaluate(finalState));
		finalOutcome = { evaluations, state: finalState, choices: [] };
		for (let i = history.length - 1; i >= 0; i--) {
			let h = history[i];
			finalOutcome.choices.unshift(h.choice);
			h.outcomes.push(finalOutcome);
			// once we've explored all the options, we can decide which choice worked out best
			if (h.choice >= h.numOptions - 1) {
				finalOutcome = h.outcomes.reduce((outcome, best) => {
					if (!best || outcome.evaluations[h.player.index] > best.evaluations[h.player.index]) {
						return outcome;
					}
					else {
						return best;
					}
				});
				// and we also remove this decision point from the history array
				history.pop();
			}
			// if we haven't explored all the options yet, then increment the final one and move onto the next step
			else {
				h.choice += 1;
				break;
			}
		}
		attemptsLeft -= 1;
		index = -1;
	} while (history.length > 0 && attemptsLeft > 0);

	// and we're done!
	return finalOutcome;
}

export default runSimulation;