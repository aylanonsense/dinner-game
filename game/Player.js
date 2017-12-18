class Player {
	constructor(index, choose, evaluate) {
		this.index = index;
		this.choose = choose; // (options, isUncertain, weights)
		this.evaluate = evaluate; // (state)
	}
	average(evaluations) {
		return evaluations.reduce((evaluation, sum) => evaluation + sum, 0) / evaluations.length;
	}
}

export default Player;