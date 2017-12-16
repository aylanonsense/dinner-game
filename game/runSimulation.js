import clone from 'clone';
import Player from './Player';

function runSimulation(game, state, evaluate) {
	// reset the game
	game.reset(state);

	// create a history of choices
	let history = [];
	let index = -1;

	// create a function for choosing from a list of options
	function choose(options, isUncertain, actualChoice) {
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
					numOptions: options.length,
					choice: 0,
					isUncertain: isUncertain || false,
					actualChoiceIndex: null,
					outcomes: []
				};
				if (!isUncertain) {
					history[index].player = this;
				}
			}
			if (options[history[index].choice] === actualChoice) { // todo this could fail miserably
				history[index].actualChoiceIndex = history[index].choice;
			}
			// console.log(`  [choice ${index}] Player ${this.index + 1} chooses ${options[history[index].choice]}`);
			// otherwise just choose based on whatever's in the history
			return options[history[index].choice];
		}
	}

	// create players
	game.players = [];
	for (let i = 0; i < game.getNumExpectedPlayers(); i++) {
		game.players.push(new Player(i, choose, evaluate));
	}

	// assign a choose function to the game simulation
	game.choose = (options, actualChoice) => {
		return choose(options, true, actualChoice);
	};

	// iterate until we arrive at a final outcome
	let finalOutcome = null;
	let attemptsLeft = 1000000;
	do {
		// console.log('Running');
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
			// once we've explored all the options, we can decide which choice worked out best)
			if (h.choice >= h.numOptions - 1) {
				// if there's uncertainty, we pick the actual choice but evaluate with an average of the choices
				if (h.isUncertain) {
					let averageEvaluation = h.outcomes[0].evaluations.map(n => 0);
					for (let i = 0; i < h.outcomes.length; i++) {
						for (let j = 0; j < h.outcomes[i].evaluations.length; j++) {
							averageEvaluation[j] += h.outcomes[i].evaluations[j] / h.outcomes.length;
						}
					}
					finalOutcome = {
						evaluations: averageEvaluation,
						state: h.outcomes[h.actualChoiceIndex].state,
						choices: finalOutcome.choices
					}
					finalOutcome.choices[0] = h.actualChoiceIndex;
				}
				// otherwise we just pick the best choice for the player
				else {
					finalOutcome = h.outcomes.reduce((outcome, best) => {
						if (!best || outcome.evaluations[h.player.index] > best.evaluations[h.player.index]) {
							return outcome;
						}
						else {
							return best;
						}
					});
				}
				// and we also remove this decision point from the history array
				history.pop();
			}
			// if we haven't explored all the options yet, then increment the final one and move onto the next step
			else {
				h.choice += 1;
				break;
			}
		}
		// console.log('  outcome:', finalOutcome.evaluations);
		attemptsLeft -= 1;
		index = -1;
	} while (history.length > 0 && attemptsLeft > 0);

	// and we're done!
	return finalOutcome;
}

export default runSimulation;