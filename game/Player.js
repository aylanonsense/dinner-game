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
		let choice = null;
		evaluations.forEach((evaluation, i) => {
			if (choice === null || evaluation > evaluations[choice]) {
				choice = i;
			}
		})
		return choice;
	}
}

export default Player;