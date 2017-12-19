import clone from 'clone';
import Player from './Player';

function debugLog(...args) {
	// console.log(...args);
}

function runSimulation(game, state, evaluate, seed) {
	// reset the game
	game.reset(state, seed);

	// create a history of choices
	let decisionHistory = [];
	let index = -1;

	// create a function for choosing from a list of options
	function choose(options, actualChoiceIndex, playersWhoKnowActualChoice, playerChoosing, isSecret) {
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
					isSecret,
					outcomes: []
				};
			}
			// then just choose based on whatever's in the decision history
			debugLog(`  Choosing [decision ${index}] [choice ${decisionHistory[index].choiceIndex}] [actual value ${options[decisionHistory[index].choiceIndex]}]`);
			return options[decisionHistory[index].choiceIndex];
		}
	}

	// create players
	game.players = [];
	for (let i = 0; i < game.getNumExpectedPlayers(); i++) {
		game.players.push(new Player(game, i, function(options) {
			return choose(options, null, null, this, false);
		}, function(options) {
			return choose(options, null, [ this ], this, true);
		}, evaluate));
	}

	// assign a choose function to the game simulation
	game.choose = (options, actualChoiceIndex, playersWhoKnowActualChoice) => {
		return choose(options, actualChoiceIndex, playersWhoKnowActualChoice || [], null, true);
	};
	game.chooseRandomly = (options, playersWhoKnowActualChoice) => {
		return choose(options, null, playersWhoKnowActualChoice || [], null, true);
	};

	// iterate until we arrive at a final outcome
	let finalOutcome = null;
	let iterations = 0;
	do {
		debugLog('Running...');
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
			debugLog(`  Looking at [decision ${decisionHistory.length - 1}]`);
			let decisionPoint = decisionHistory[decisionHistory.length - 1];
			// piece together an array of the choices that were made
			finalOutcome.choices.unshift(decisionPoint.choiceIndex);
			// keep track of the outcome of each option of the decision
			decisionPoint.outcomes[decisionPoint.choiceIndex] = clone(finalOutcome);
			// if we haven't explored all the options for this decision point yet, try the next one!
			if(decisionPoint.choiceIndex < decisionPoint.numOptions - 1) {
				decisionPoint.choiceIndex += 1;
				debugLog(`    Resetting to [decision ${decisionHistory.length - 1}] [choice ${decisionPoint.choiceIndex}]`);
				break;
			}
			debugLog(`    Evaluating final choice to [decision ${decisionHistory.length - 1}]`);
			// once we've explored all the options of this decision point, we can decide which choice worked out best
			let actualChoiceIndex = null;
			// if a player is making the choice, we choose the outcome that evaluated best for that player
			let player = decisionPoint.playerChoosing;
			if (player) {
				debugLog('    The player gets to make the choice');
				actualChoiceIndex = player.pickEvaluation(decisionPoint.outcomes.map(outcome => outcome.evaluations[player.index]));
			}
			// if a player isn't making the choice, then we might know what the actual choice will end up being
			else if (typeof(decisionPoint.actualChoiceIndex) === 'number') {
				debugLog('    The choice is already decided');
				actualChoiceIndex = decisionPoint.actualChoiceIndex;
			}
			// but if we don't, we'll choose something randomly
			else {
				actualChoiceIndex = Math.floor(game.rand() * decisionPoint.numOptions);
				debugLog(`    The choice was decided randomly [choice ${actualChoiceIndex}]`);
			}
			// now that we know what the actual choice will be, we can handle the evaluations
			debugLog(`    Deciding on [choice ${actualChoiceIndex}]`);
			let actualOutcome = decisionPoint.outcomes[actualChoiceIndex];
			debugLog(`      The evaluations for each outcome are  ${decisionPoint.outcomes.map(outcome => outcome.evaluations.join('/')).join('  ')}`);
			finalOutcome.state = actualOutcome.state;
			finalOutcome.choices[0] = actualChoiceIndex;
			// if the actual choice is secret, the evaluations will be based on an average of all the outcomes
			if (decisionPoint.isSecret) {
				finalOutcome.evaluations = game.players.map(player => player.average(decisionPoint.outcomes.map(outcome => outcome.evaluations[player.index])));
				// ...except the choice is not a secret for everybody!
				decisionPoint.playersWhoKnowActualChoice.forEach(player => {
					debugLog(`      [Player ${player.index}] knows the actual evaluation of [decision ${decisionHistory.length - 1}] (${actualOutcome.evaluations[player.index]} rather than ${finalOutcome.evaluations[player.index]})`)
					finalOutcome.evaluations[player.index] = actualOutcome.evaluations[player.index];
				});
			}
			// otherwise it's public information, and the evaluations have no uncertainty
			else {
				finalOutcome.evaluations = actualOutcome.evaluations;
			}
			// and now we're done with this decision point!
			decisionHistory.pop();
		}
		// only try so many iterations
		iterations++;
		if (iterations >= 100000) {
			throw new Error('Failed to fully evaluate in fewer than 10,000 iterations');
		}
	} while (decisionHistory.length > 0);

	// and we're done!
	return finalOutcome;
}

export default runSimulation;