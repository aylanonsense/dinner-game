import clone from 'clone';
import Player from './Player';

function runSimulation(game, state, evaluate) {
	// reset the game
	game.reset(state);

	// create a history of choices
	let decisionHistory = [];
	let index = -1;

	// create a function for choosing from a list of options
	function choose(options, actualChoiceIndex, playersWhoKnowActualChoice, playerChoosing) {
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
			if (!decisionHistory[index]) {
				decisionHistory[index] = {
					numOptions: options.length,
					choiceIndex: 0,
					actualChoiceIndex,
					playersWhoKnowActualChoice,
					playerChoosing,
					outcomes: []
				};
			}
			// then just choose based on whatever's in the decision history
			// console.log(`  [descision ${index}] ${decisionHistory[index].choiceIndex} (${options[decisionHistory[index].choiceIndex]})`);
			return options[decisionHistory[index].choiceIndex];
		}
	}

	// create players
	game.players = [];
	for (let i = 0; i < game.getNumExpectedPlayers(); i++) {
		game.players.push(new Player(i, function(options) {
			return choose(options, null, null, this);
		}, evaluate));
	}

	// assign a choose function to the game simulation
	game.choose = (options, actualChoiceIndex, playersWhoKnowActualChoice) => {
		return choose(options, actualChoiceIndex, playersWhoKnowActualChoice || [], null);
	};

	// iterate until we arrive at a final outcome
	let finalOutcome = null;
	let iterations = 0;
	do {
		// console.log('Running...');
		index = -1;
		// run the simulation for a bit, thus forcing the players to make choices
		game.reset(clone(state));
		game.run();
		// get the final state of the game
		let finalState = game.state;
		// have each player evaluate the outcome of the game
		let evaluations = game.players.map(player => player.evaluate(finalState));
		finalOutcome = { evaluations, state: finalState, choices: [] };
		// then work backwards through the history of decisions that were made
		while (decisionHistory.length > 0) {
			// console.log('  Inspecting...');
			// console.log(`    Looking at [decision ${decisionHistory.length - 1}]`);
			let decisionPoint = decisionHistory[decisionHistory.length - 1];
			// piece together an array of the choices that were made
			finalOutcome.choices.unshift(decisionPoint.choiceIndex);
			// keep track of the outcome of each option of the decision
			decisionPoint.outcomes[decisionPoint.choiceIndex] = finalOutcome;
			// if we haven't explored all the options for this decision point yet, try the next one!
			if(decisionPoint.choiceIndex < decisionPoint.numOptions - 1) {
				decisionPoint.choiceIndex += 1;
				break;
			}
			// once we've explored all the options of this decision point, we can decide which choice worked out best
			else {
				// if a player is making the choice, we choose the outcome that evaluated best for that player
				let player = decisionPoint.playerChoosing;
				if (player) {
					// console.log(`      The decision was made by player ${player.index}`);
					finalOutcome = decisionPoint.outcomes.reduce((outcome, best) => {
						if (!best || outcome.evaluations[player.index] > best.evaluations[player.index]) {
							return outcome;
						}
						else {
							return best;
						}
					});
				}
				//if a player isn't making the choice, then we know what the actual choice will end up being
				else {
					// console.log(`      The decision was not made by a player`);
					// console.log(decisionPoint);
					let actualOutcome = decisionPoint.outcomes[decisionPoint.actualChoiceIndex];
					// the players don't know the actual choice, so they evaluate based on the average of all outcomes
					let evaluations = game.players.map(player => player.average(decisionPoint.outcomes.map(outcome => outcome.evaluations[player.index])));
					// except some players DO know the actual choice, so they evaluate based on the actual outcome
					decisionPoint.playersWhoKnowActualChoice.forEach(player => {
						evaluations[player.index] = actualOutcome.evaluations[player.index];
					});
					// and that gives us the outcome on an event with uncertainty!
					finalOutcome = {
						evaluations: evaluations,
						state: actualOutcome.state,
						choices: finalOutcome.choices
					};
					finalOutcome.choices[0] = decisionPoint.actualChoiceIndex;
				}
				// and now we're done with this decision point!
				decisionHistory.pop();
			}
		}
		// only try so many iterations
		iterations++;
		if (iterations >= 10000) {
			throw new Error('Failed to fully evaluate in fewer than 10,000 iterations');
		}
	} while (decisionHistory.length > 0);

	// and we're done!
	return finalOutcome;
}

export default runSimulation;