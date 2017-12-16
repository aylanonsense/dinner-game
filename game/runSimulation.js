function runSimulation(game, state) {
	// reset the game
	game.reset(state);
	// create a history of choices
	let history = [];
	let index = -1;
	function choose(options, isUncertain, weights) {
		// a choice with one or fewer options doesn't count as a meaningful choice
		if (!options || options.length === 0) {
			return null;
		}
		else if (options.length === 1) {
			return options[0];
		}
		else {
			index += 1;
			// just blindly choose the first option to start
			if (!history[index]) {
				history[index] = {
					player: this,
					numOptions: options.length,
					choice: 0,
					bestChoice: null,
					bestEvaluations: null
				};
				return options[0];
			}
			// otherwise, if this is the last option in the history, choose the next option
			else if (index === history.length - 1) {
				history[index].choice += 1;
				return options[history[index].choice];
			}
			// otherwise, if this isn't the option we're changing up right now, just make the same choice again
			else {
				return options[history[index].choice];
			}
		}
	}
	function evaluate(state) {
		return 0;
	}
	// create players
	let players = [];
	for (let i = 0; i < game.getNumExpectedPlayers(); i++) {
		players.push(new Player(i, choose, evaluate));
	}
	do {
		// run the simulation for a bit, thus forcing the players to make choices
		game.run();
		// get the final state of the game
		let state = game.state;
		// have each player evaluate the outcome of the game
		let evaluations = players.map(player => player.evaluate(state));
		// iterate through the history of choices, and update the best choice for each option
		// this might not be how this works... yeah we need to start from the end and work backwards
		for (let h of history) {
			if (!h.bestEvaluations || h.bestEvaluations[h.player.index] < evaluations[h.player.index]) {
				h.bestChoice = h.choice;
				h.bestEvaluations = evaluations;
			}
		}
		for (let i = 0; i < history.length; i++) {
			if (!history[i].bestEvaluations || history[i].bestEvaluations[]
		}
	} while (history[0]);
}

// function exploreOptions(player, choiceHistory, options, isUncertain, weights) {
	
// }

// how could we frame this recursively

// get prompted with a choice
// iterate through each option, exploring the possibilities
// go with the choice that ends up the highest evaluated value
// return the evaluated value -- but wait for who?
// for everyone?
// can we return outcomes? what about uncertainty?
// 1. we have to choose to either evaluate the value for each player or
// 2. return an array of all possibilities and their weights
// i think we should do the former

// make a choice, and then:
// 