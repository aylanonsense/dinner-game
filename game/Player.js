class Player {
	constructor(game, index, choose, chooseSecretly, evaluate) {
		this.game = game;
		this.index = index;
		this.choose = choose; // (options)
		this.chooseSecretly = chooseSecretly; // (options)
		this.evaluate = evaluate; // (state)
	}
	average(evaluations) {
		return evaluations.reduce((evaluation, sum) => evaluation + sum, 0) / evaluations.length;
	}
	pickEvaluation(evaluations) {
		let bestChoices = [];
		evaluations.forEach((evaluation, i) => {
			// this choice might be strictly better
			if (bestChoices.length <= 0 || evaluation > evaluations[bestChoices[0]] + 0.01) {
				bestChoices = [ i ];
			}
			// or it might be just as good
			else if (evaluation > evaluations[bestChoices[0]] - 0.01) {
				bestChoices.push(i);
			}
			// or it might be strictly worse
		})
		// return the best choice
		if (bestChoices.length === 1) {
			return bestChoices[0];
		}
		// return null if there are no options
		else if (bestChoices.length <= 0) {
			return null;
		}
		// return one of the best choices at random
		else {
			return bestChoices[Math.floor(this.game.rand() * bestChoices.length)];
		}
	}
}

export default Player;