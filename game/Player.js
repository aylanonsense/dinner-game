class Player {
	constructor(index, choose, chooseSecretly, evaluate) {
		this.index = index;
		this.choose = choose; // (options)
		this.chooseSecretly = chooseSecretly; // (options)
		this.evaluate = evaluate; // (state)
	}
	average(evaluations) {
		return evaluations.reduce((evaluation, sum) => evaluation + sum, 0) / evaluations.length;
	}
}

export default Player;