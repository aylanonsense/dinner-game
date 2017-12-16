class Player {
	constructor(index, choose, evaluate) {
		this.index = index;
		this.choose = choose; // (options, isUncertain, weights)
		this.evaluate = evaluate; // stat
	}
}