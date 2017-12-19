function evaluate(state) {
	let { hand, table, held, plate, tummy } = state.guests[this.index];
	// let's just try to maximize the stuff on your plate
	return plate.length;
}

export default evaluate;